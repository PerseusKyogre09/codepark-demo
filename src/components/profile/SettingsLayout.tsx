import React, { useState } from 'react';
import { type User } from '../../types';
import { User as UserIcon, Settings as SettingsIcon, Palette, Code, BarChart } from 'lucide-react';
import SettingsSectionProfile from './settings/SettingsSectionProfile';
import SettingsSectionAccount from './settings/SettingsSectionAccount';
import SettingsSectionAppearance from './settings/SettingsSectionAppearance';
import SettingsSectionDeveloper from './settings/SettingsSectionDeveloper';
import SettingsSectionStatistics from './settings/SettingsSectionStatistics';

interface SettingsLayoutProps {
    viewedUser: User | null;
    setViewedUser: React.Dispatch<React.SetStateAction<User | null>>;
    onUpdateDisplaySettings: (layout: string[], hiddenCards: string[]) => void;
    onSectionChange?: (section: SettingsSection) => void;
}

type SettingsSection = 'profile' | 'account' | 'appearance' | 'statistics' | 'developer';

export default function SettingsLayout({ viewedUser, setViewedUser, onUpdateDisplaySettings, onSectionChange }: SettingsLayoutProps) {
    const [activeSection, setActiveSection] = useState<SettingsSection>('profile');

    const handleSectionChange = (section: SettingsSection) => {
        setActiveSection(section);
        onSectionChange?.(section);
    };

    const sidebarItems = [
        { id: 'profile' as const, label: 'Public profile', icon: UserIcon },
        { id: 'account' as const, label: 'Account', icon: SettingsIcon },
        { id: 'appearance' as const, label: 'Appearance', icon: Palette },
        { id: 'statistics' as const, label: 'Statistics', icon: BarChart },
        { id: 'developer' as const, label: 'Developer', icon: Code },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
                <nav className="space-y-1">
                    {sidebarItems.map((item) => {
                        const isActive = activeSection === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleSectionChange(item.id)}
                                className={`w-full flex items-center gap-2 px-3 py-2 rounded border text-sm font-medium transition-all`}
                                style={{
                                    borderColor: isActive ? 'rgba(63, 255, 139, 0.4)' : 'rgba(63, 255, 139, 0.1)',
                                    background: isActive ? 'rgba(63, 255, 139, 0.08)' : 'transparent',
                                    color: isActive ? '#3fff8b' : '#acaab1',
                                    fontFamily: 'Space Mono, monospace',
                                }}
                            >
                                <span style={{ color: '#acaab1' }}>&gt;</span>
                                {item.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
                <div className="p-1"> {/* Padding for potential scroll alignment */}
                    {activeSection === 'profile' && (
                        <SettingsSectionProfile
                            viewedUser={viewedUser}
                            setViewedUser={setViewedUser}
                            onUpdateDisplaySettings={onUpdateDisplaySettings}
                        />
                    )}
                    {activeSection === 'account' && (
                        <SettingsSectionAccount />
                    )}
                    {activeSection === 'appearance' && (
                        <SettingsSectionAppearance />
                    )}
                    {activeSection === 'statistics' && (
                        <SettingsSectionStatistics />
                    )}
                    {activeSection === 'developer' && (
                        <SettingsSectionDeveloper />
                    )}
                </div>
            </div>
        </div>
    );
}
