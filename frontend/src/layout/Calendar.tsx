// src/components/Calendar/Calendar.tsx
import React from 'react';
import DonationCard from '../DonationCard';
import MonthPicker from '../MonthPicker';

interface CalendarProps {
    donations: Donation[];
}

const Calendar: React.FC<CalendarProps> = ({ donations }) => {
    // Calendar rendering logic
    return (
        <div>
            <MonthPicker />
            <div className="calendar-grid">
                {donations.map((donation) => (
                    <DonationCard key={donation.id} donation={donation} />
                ))}
            </div>
        </div>
    );
};

export default Calendar;
