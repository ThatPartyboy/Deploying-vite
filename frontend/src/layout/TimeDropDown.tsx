// src/components/TimeDropdown/TimeDropdown.tsx
import React from 'react';

interface TimeDropdownProps {
    selectedTime: string;
    onTimeChange: (time: string) => void;
}

const TimeDropdown: React.FC<TimeDropdownProps> = ({ selectedTime, onTimeChange }) => {
    // Logic for time selection dropdown

    return (
        <select value={selectedTime} onChange={(e) => onTimeChange(e.target.value)}>
            {/* Time options */}
        </select>
    );
};

export default TimeDropdown;
