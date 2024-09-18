import React, { useState, useCallback } from 'react'
import * as ScrollArea from '@/components/ui/scroll-area'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'

type CalendarDate = Date | null

interface Event {
    id: number
    title: string
    date: Date
}

const CalendarSidenav: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<CalendarDate>(new Date())
    const [currentMonth, setCurrentMonth] = useState(new Date())

    const onDateSelect = useCallback((date: Date) => {
        setSelectedDate(date)
    }, [])

    const changeMonth = useCallback((offset: number) => {
        setCurrentMonth(prevMonth => {
            const newMonth = new Date(prevMonth)
            newMonth.setMonth(newMonth.getMonth() + offset)
            return newMonth
        })
    }, [])

    const renderCalendar = () => {
        const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
        const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
        const startDate = new Date(monthStart)
        startDate.setDate(startDate.getDate() - startDate.getDay())
        const endDate = new Date(monthEnd)
        endDate.setDate(endDate.getDate() + (6 - endDate.getDay()))

        const dateFormat = new Intl.DateTimeFormat('en-US', { weekday: 'short' })
        const rows = []
        let days = []
        const day = startDate

        // Render weekday headers
        const weekdayHeaders = [...Array(7)].map((_, i) => {
            const date = new Date(startDate)
            date.setDate(date.getDate() + i)
            return (
                <div key={`header-${i}`} className="text-center font-bold p-2">
                    {dateFormat.format(date).charAt(0)}
                </div>
            )
        })
        rows.push(<div key="header" className="grid grid-cols-7">{weekdayHeaders}</div>)

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const cloneDay = new Date(day)
                days.push(
                    <div
                        key={day.toISOString()}
                        onClick={() => onDateSelect(cloneDay)}
                        className={`p-2 text-center cursor-pointer hover:bg-gray-200 ${
                            day.getMonth() !== currentMonth.getMonth() ? 'text-gray-400' : ''
                        } ${
                            selectedDate && day.toDateString() === selectedDate.toDateString()
                                ? 'bg-blue-500 text-white'
                                : ''
                        }`}
                    >
                        {day.getDate()}
                    </div>
                )
                day.setDate(day.getDate() + 1)
            }
            rows.push(
                <div key={day.toISOString()} className="grid grid-cols-7">
                    {days}
                </div>
            )
            days = []
        }
        return rows
    }

    // Mock events data
    const events: Event[] = [
        { id: 1, title: 'Team Meeting', date: new Date(Date.now() + 86400000) },
        { id: 2, title: 'Project Deadline', date: new Date(Date.now() + 172800000) },
        { id: 3, title: 'Conference Call', date: new Date(Date.now() + 259200000) },
        { id: 4, title: 'Review Session', date: new Date(Date.now() + 345600000) },
        { id: 5, title: 'Client Presentation', date: new Date(Date.now() + 432000000) },
    ]

    return (
        <div className="w-64 h-screen bg-white border-r border-gray-200">
            <div className="p-4">
                <h2 className="text-lg font-semibold mb-4">Calendar</h2>
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <button onClick={() => changeMonth(-1)} className="p-1">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="font-semibold">
              {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
                        <button onClick={() => changeMonth(1)} className="p-1">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="border rounded-md shadow-sm">
                        {renderCalendar()}
                    </div>
                </div>
                <div className="mt-4 space-y-2">
                    <button
                        onClick={() => setSelectedDate(new Date())}
                        className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center"
                    >
                        <CalendarDays className="mr-2 h-4 w-4" />
                        Today
                    </button>
                    <div className="flex space-x-2">
                        <button className="flex-1 py-1 px-2 bg-gray-100 hover:bg-gray-200 rounded">Day</button>
                        <button className="flex-1 py-1 px-2 bg-gray-100 hover:bg-gray-200 rounded">Week</button>
                        <button className="flex-1 py-1 px-2 bg-gray-100 hover:bg-gray-200 rounded">Month</button>
                    </div>
                </div>
            </div>
            <div className="p-4 border-t border-gray-200">
                <h3 className="font-semibold mb-2">Upcoming Events</h3>
                <ScrollArea.Root className="h-48 overflow-hidden">
                    <ScrollArea.Viewport className="h-full w-full">
                        <div className="space-y-2">
                            {events.map((event) => (
                                <div key={event.id} className="p-2 bg-gray-100 rounded-md">
                                    <p className="font-medium">{event.title}</p>
                                    <p className="text-sm text-gray-600">
                                        {event.date.toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </ScrollArea.Viewport>
                    <ScrollArea.Scrollbar
                        className="flex select-none touch-none p-0.5 bg-gray-200 transition-colors duration-[160ms] ease-out hover:bg-gray-300 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
                        orientation="vertical"
                    >
                        <ScrollArea.Thumb className="flex-1 bg-gray-400 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
                    </ScrollArea.Scrollbar>
                </ScrollArea.Root>
            </div>
        </div>
    )
}

export default CalendarSidenav
