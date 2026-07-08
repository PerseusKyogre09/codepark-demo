import { useState, useEffect } from 'react'
import { Reorder } from 'motion/react'
import { GripVertical, Eye, EyeOff } from 'lucide-react'

interface DisplaySettingsProps {
    layout: string[]
    hiddenCards: string[]
    onUpdate: (layout: string[], hiddenCards: string[]) => void
}

const AVAILABLE_CARDS = [
    { id: 'streak', label: 'Streak Counter' },
    { id: 'activity', label: 'Contribution Activity' },
    { id: 'achievements', label: 'Achievements' },
]

export default function DisplaySettings({ layout, hiddenCards, onUpdate }: DisplaySettingsProps) {

    // Ensure all available cards are in the list, appending any new ones to the end if missing
    const initialItems = [...layout]
    AVAILABLE_CARDS.forEach(card => {
        if (!initialItems.includes(card.id)) {
            initialItems.push(card.id)
        }
    })

    const [items, setItems] = useState(initialItems)
    const [hidden, setHidden] = useState<string[]>(hiddenCards)

    useEffect(() => {
        // Sync local state if props change externally
        // setItems(layout) // Careful with loops
    }, [layout])

    const handleReorder = (newOrder: string[]) => {
        setItems(newOrder)
        onUpdate(newOrder, hidden)
    }

    const toggleVisibility = (id: string) => {
        let newHidden;
        if (hidden.includes(id)) {
            newHidden = hidden.filter(itemId => itemId !== id)
        } else {
            newHidden = [...hidden, id]
        }
        setHidden(newHidden)
        onUpdate(items, newHidden)
    }

    return (
        <div className="space-y-6">


            <Reorder.Group axis="y" values={items} onReorder={handleReorder} className="space-y-3">
                {items.map((item) => {
                    const cardInfo = AVAILABLE_CARDS.find(c => c.id === item) || { id: item, label: item }
                    const isHidden = hidden.includes(item)

                    return (
                        <Reorder.Item
                            key={item}
                            value={item}
                            className="relative"
                        >
                            <div
                                className={`flex items-center gap-4 p-4 rounded border transition-colors ${isHidden ? 'opacity-60' : ''}`}
                                style={{
                                    borderColor: isHidden ? 'rgba(63, 255, 139, 0.15)' : 'rgba(63, 255, 139, 0.3)',
                                    backgroundColor: isHidden ? 'rgba(63, 255, 139, 0.04)' : 'rgba(63, 255, 139, 0.08)',
                                }}
                            >
                                {/* Drag Handle */}
                                <div className="cursor-grab active:cursor-grabbing p-1 rounded" style={{ color: '#acaab1' }}>
                                    <GripVertical className="w-4 h-4" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 font-medium" style={{ fontFamily: 'Space Mono, monospace', color: isHidden ? '#acaab1' : '#3fff8b' }}>
                                    <span style={{ color: '#acaab1' }}>&gt;</span> {cardInfo.label}
                                </div>

                                {/* Visibility Toggle */}
                                <button
                                    onClick={() => toggleVisibility(item)}
                                    className="p-2 rounded transition-colors"
                                    style={{
                                        color: isHidden ? '#ff6b6b' : '#3fff8b',
                                        backgroundColor: isHidden ? 'rgba(255, 107, 107, 0.1)' : 'rgba(63, 255, 139, 0.1)',
                                    }}
                                >
                                    {isHidden ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </Reorder.Item>
                    )
                })}
            </Reorder.Group>
        </div>
    )
}
