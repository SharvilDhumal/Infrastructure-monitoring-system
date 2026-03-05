const Issue = require('../models/Issue');
const Pothole = require('../models/Pothole');
const Bridge = require('../models/Bridge');
const WaterLeakage = require('../models/WaterLeakage');
const Streetlight = require('../models/Streetlight');
const { AssignedIssue, ResolvedIssue } = require('../models/ActionIssue');

exports.getAnalytics = async (req, res) => {
    try {
        // 1. Basic Counts
        const [
            totalPublic,
            totalPotholes,
            totalBridges,
            totalWater,
            totalStreetlights,
            assignedCount,
            resolvedCount
        ] = await Promise.all([
            Issue.countDocuments(),
            Pothole.countDocuments(),
            Bridge.countDocuments(),
            WaterLeakage.countDocuments(),
            Streetlight.countDocuments(),
            AssignedIssue.countDocuments(),
            ResolvedIssue.countDocuments()
        ]);

        const totalIssues = totalPublic + totalPotholes + totalBridges + totalWater + totalStreetlights;
        const activeIssues = assignedCount + (totalIssues - assignedCount - resolvedCount); // Rough estimate of unassigned + assigned
        // Actually, let's just use what's in the system:
        // totalIssues = total across all source collections
        // resolvedIssues = count in ResolvedIssue
        // activeIssues = totalIssues - resolvedIssues

        const resolutionRate = totalIssues > 0 ? (resolvedCount / totalIssues) * 100 : 0;

        // 2. Severity Counts (Aggregate from Pothole, Bridge, WaterLeakage)
        const getSeverityAggregate = async (Model, fieldName = 'severity') => {
            return await Model.aggregate([
                { $group: { _id: `$${fieldName}`, count: { $sum: 1 } } }
            ]);
        };

        const [potholeSev, bridgeSev, waterSev] = await Promise.all([
            getSeverityAggregate(Pothole),
            getSeverityAggregate(Bridge),
            getSeverityAggregate(WaterLeakage, 'leakSeverity')
        ]);

        const severityCounts = { critical: 0, high: 0, medium: 0, low: 0 };
        [...potholeSev, ...bridgeSev, ...waterSev].forEach(item => {
            const sev = (item._id || '').toLowerCase();
            if (sev === 'high') severityCounts.high += item.count;
            else if (sev === 'medium') severityCounts.medium += item.count;
            else if (sev === 'low') severityCounts.low += item.count;
        });

        // 3. Issue Trends (Last 30 days as default)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const getTrendData = async (Model, dateField = 'createdAt') => {
            return await Model.aggregate([
                { $match: { [dateField]: { $gte: thirtyDaysAgo } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: `$${dateField}` } },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { "_id": 1 } }
            ]);
        };

        // Note: Bridge, Pothole, WaterLeakage use 'timestamp'. Issue uses 'createdAt'.
        const [publicTrend, potholeTrend, bridgeTrend, waterTrend, lightTrend] = await Promise.all([
            getTrendData(Issue, 'createdAt'),
            getTrendData(Pothole, 'timestamp'),
            getTrendData(Bridge, 'timestamp'),
            getTrendData(WaterLeakage, 'timestamp'),
            getTrendData(Streetlight, 'timestamp')
        ]);

        // Merge trends
        const trendMap = {};
        [...publicTrend, ...potholeTrend, ...bridgeTrend, ...waterTrend, ...lightTrend].forEach(item => {
            trendMap[item._id] = (trendMap[item._id] || 0) + item.count;
        });
        const issueTrends = Object.keys(trendMap).sort().map(date => ({ date, count: trendMap[date] }));

        // 4. Asset Health
        // For simplicity: (resolved in that category / total in that category) * 100
        // We'd need to know sourceCollection in ResolvedIssue.
        const resolvedByCategory = await ResolvedIssue.aggregate([
            { $group: { _id: "$sourceCollection", count: { $sum: 1 } } }
        ]);
        const resolvedMap = {};
        resolvedByCategory.forEach(item => { resolvedMap[item._id] = item.count; });

        const assetHealth = [
            { asset: 'Roads', issues: totalPotholes, resolved: resolvedMap['potholes'] || 0 },
            { asset: 'Street Lights', issues: totalStreetlights, resolved: resolvedMap['streetlights'] || 0 },
            { asset: 'Water Systems', issues: totalWater, resolved: resolvedMap['waterleakage'] || 0 },
            { asset: 'Bridges', issues: totalBridges, resolved: resolvedMap['bridge'] || 0 }
        ].map(item => ({
            ...item,
            health: item.issues > 0 ? Math.round((item.resolved / item.issues) * 100) : 100
        }));

        // 5. Top Issue Types
        const topIssueTypes = [
            { type: 'Potholes', count: totalPotholes, trend: 'stable' },
            { type: 'Street Light Failures', count: totalStreetlights, trend: 'stable' },
            { type: 'Water Leaks', count: totalWater, trend: 'stable' },
            { type: 'Structural Anomalies', count: totalBridges, trend: 'stable' },
            { type: 'Public Reports', count: totalPublic, trend: 'stable' }
        ].sort((a, b) => b.count - a.count);

        res.status(200).json({
            success: true,
            data: {
                totalIssues,
                activeIssues,
                resolvedIssues: resolvedCount,
                resolutionRate,
                severityCounts,
                issueTrends,
                assetHealth,
                topIssueTypes
            }
        });

    } catch (error) {
        console.error('Analytics Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
