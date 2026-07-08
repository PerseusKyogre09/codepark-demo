import React, { useEffect, useState } from 'react';
import { apiClient } from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';
import './ActivityGraph.css';

interface ActivityGraphProps {
    username: string;
    data?: Record<string, number>;
}

const ActivityGraph: React.FC<ActivityGraphProps> = ({ username, data }) => {
    const [activityData, setActivityData] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const { settings, themeColors } = useTheme();

    useEffect(() => {
        if (data) {
            setActivityData(data);
            setLoading(false);
            return;
        }

        const fetchActivity = async () => {
            try {
                const fetchedData = await apiClient.getUserActivity(username);
                setActivityData(fetchedData.heatmap);
            } catch (err) {
                console.error('Failed to fetch user activity:', err);
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchActivity();
        }
    }, [username, data]);

    // Helper to get color with opacity
    const getColor = (count: number) => {
        if (count === 0) return settings.uiTheme === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';

        const baseColor = settings.accentColor;
        let opacity = 0.2;
        if (count > 0) opacity = 0.4;
        if (count > 2) opacity = 0.6;
        if (count > 5) opacity = 0.8;
        if (count > 10) opacity = 1.0;

        if (baseColor.startsWith('#')) {
            const r = parseInt(baseColor.slice(1, 3), 16);
            const g = parseInt(baseColor.slice(3, 5), 16);
            const b = parseInt(baseColor.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
        return baseColor;
    };

    // Calculate dates for the last year (52 weeks + remaining days)
    const renderCalendar = () => {
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 365);

        // Align start date to Sunday/Monday to ensure nice grid?
        // Actually GitHub graph usually starts ~1 year ago, but aligned so the last column is 'today'.
        // So the grid is usually 53 columns.

        // We need 53 weeks. 
        const weeks = [];
        const currentDate = new Date(startDate);

        // Adjust start date to the previous Sunday (or Monday, depending on preference)
        // Let's assume Sunday start for rows (0)
        const dayOfWeek = currentDate.getDay(); // 0 is Sunday
        currentDate.setDate(currentDate.getDate() - dayOfWeek);

        for (let w = 0; w < 53; w++) {
            const weekDays = [];
            for (let d = 0; d < 7; d++) {
                const dateString = currentDate.toISOString().split('T')[0];
                const count = activityData[dateString] || 0;

                // Don't render future days
                const isFuture = currentDate > new Date();

                weekDays.push({
                    date: dateString,
                    count: isFuture ? -1 : count,
                    obj: new Date(currentDate)
                });
                currentDate.setDate(currentDate.getDate() + 1);
            }
            weeks.push(weekDays);
        }

        return weeks;
    };

    const calendarWeeks = renderCalendar();

    // Months labels
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    interface MonthLabel {
        name: string;
        index: number;
    }

    const monthLabels: MonthLabel[] = [];
    let lastMonth = -1;

    calendarWeeks.forEach((week, weekIndex) => {
        const firstDayOfWeek = week[0].obj;
        const month = firstDayOfWeek.getMonth();

        // Add label if month changed
        if (month !== lastMonth) {
            monthLabels.push({
                name: months[month],
                index: weekIndex
            });
            lastMonth = month;
        }
    });

    if (loading) return <div className="activity-graph-loading" style={{ color: themeColors.textSecondary }}>Loading contributions...</div>;

    return (
        <div className="activity-graph-container">
            <div className="activity-header">
                <h3 style={{ color: themeColors.text }}>Contribution Activity</h3>
            </div>

            <div className="activity-chart-wrapper">
                <div className="activity-days-labels" style={{ color: themeColors.textSecondary }}>
                    <span>Mon</span>
                    <span>Wed</span>
                    <span>Fri</span>
                </div>

                <div className="activity-grid-scroll">
                    <div className="activity-months-labels" style={{ color: themeColors.textSecondary }}>
                        {monthLabels.map((m, i) => (
                            <span key={i} style={{ left: `${m.index * 13}px` }}>{m.name}</span>
                        ))}
                    </div>

                    <div className="activity-grid">
                        {calendarWeeks.map((week, wIndex) => (
                            <div key={wIndex} className="activity-week">
                                {week.map((day, dIndex) => (
                                    day.count !== -1 ? (
                                        <div
                                            key={dIndex}
                                            className="activity-day"
                                            title={`${day.count} contributions on ${day.date}`}
                                            style={{
                                                backgroundColor: getColor(day.count),
                                                boxShadow: day.count > 0 ? `0 0 4px ${getColor(day.count)}` : 'none',
                                                borderColor: settings.uiTheme === 'light' ? 'rgba(0,0,0,0.05)' : 'transparent'
                                            }}
                                        />
                                    ) : (
                                        <div key={dIndex} className="activity-day-empty" />
                                    )
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="activity-footer">
                <span className="text-xs opacity-50" style={{ color: themeColors.textSecondary }}>Learn how we count contributions</span>
                <div className="activity-legend" style={{ color: themeColors.textSecondary }}>
                    <span>Less</span>
                    <div className="legend-item" style={{ backgroundColor: settings.uiTheme === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)' }}></div>
                    <div className="legend-item" style={{ backgroundColor: getColor(1) }}></div>
                    <div className="legend-item" style={{ backgroundColor: getColor(4) }}></div>
                    <div className="legend-item" style={{ backgroundColor: getColor(7) }}></div>
                    <div className="legend-item" style={{ backgroundColor: getColor(11) }}></div>
                    <span>More</span>
                </div>
            </div>
        </div>
    );
};

export default ActivityGraph;
