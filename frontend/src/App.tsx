import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface Donation {
  title: string;
  date: string;
  type: DonationType;
}

const donationTypes = [
  { value: 'hygiene', label: 'Hygiene', color: 'bg-green-100 hover:bg-green-200 text-green-800' },
  { value: 'food', label: 'Food', color: 'bg-orange-100 hover:bg-orange-200 text-orange-800' },
  { value: 'clothing', label: 'Clothing', color: 'bg-blue-100 hover:bg-blue-200 text-blue-800' },
  { value: 'medical', label: 'Medical Supplies', color: 'bg-red-100 hover:bg-red-200 text-red-800' },
  { value: 'volunteer', label: 'Volunteer Time', color: 'bg-purple-100 hover:bg-purple-200 text-purple-800' },
] as const;

type DonationType = typeof donationTypes[number]['value'];

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
] as const;

const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

const Cal: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [donations, setDonations] = useState<Donation[]>([]);
  const [showDonationModal, setShowDonationModal] = useState<boolean>(false);
  const [showDateModal, setShowDateModal] = useState<boolean>(false);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [newDonation, setNewDonation] = useState<Donation>({
    title: '',
    date: '',
    type: 'hygiene',
  });
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth());

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);

    const calendarDays = [];
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    for (let day = 1; day <= days; day++) {
      const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayDonations = donations.filter((donation) => donation.date === date);
      const isToday = new Date().toDateString() === new Date(date).toDateString();

      calendarDays.push(
        <Card key={day} className={`min-h-[120px] cursor-pointer hover:shadow-lg transition-shadow duration-200 ${isToday ? 'border-2 border-blue-500' : ''}`} onClick={() => handleSelectDay(date)}>
          <CardContent className="p-2">
            <div className={`font-bold text-right ${isToday ? 'text-blue-500' : 'text-gray-600'}`}>{day}</div>
            {dayDonations.map((donation, index) => {
              const donationType = donationTypes.find(t => t.value === donation.type);
              return (
                <div 
                  key={index} 
                  className={`${donationType ? donationType.color : ''} p-2 mb-1 rounded-md text-sm cursor-pointer transition-colors duration-200 truncate`} 
                  onClick={(e) => handleSelectDonation(e, donation)}
                >
                  {donation.title}
                </div>
              );
            })}
          </CardContent>
        </Card>
      );
    }

    return calendarDays;
  };

  const handleSelectDay = (date: string) => {
    setNewDonation({ title: '', date, type: 'hygiene' });
    setSelectedDonation(null);
    setShowDonationModal(true);
  };

  const handleSelectDonation = (e: React.MouseEvent, donation: Donation) => {
    e.stopPropagation();
    setSelectedDonation(donation);
    setNewDonation(donation);
    setShowDonationModal(true);
  };

  const handleCreateDonation = () => {
    setDonations([...donations, newDonation]);
    setShowDonationModal(false);
  };

  const handleUpdateDonation = () => {
    const updatedDonations = donations.map((donation) =>
      donation === selectedDonation ? newDonation : donation
    );
    setDonations(updatedDonations);
    setShowDonationModal(false);
  };

  const handleDeleteDonation = () => {
    const updatedDonations = donations.filter((donation) => donation !== selectedDonation);
    setDonations(updatedDonations);
    setShowDonationModal(false);
  };

  const handleDateClick = () => {
    setSelectedYear(currentDate.getFullYear());
    setSelectedMonth(currentDate.getMonth());
    setShowDateModal(true);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedYear(parseInt(e.target.value));
  };

  const handleMonthChange = (value: string) => {
    setSelectedMonth(months.indexOf(value as typeof months[number]));
  };

  const handleDateSubmit = () => {
    setCurrentDate(new Date(selectedYear, selectedMonth, 1));
    setShowDateModal(false);
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-lg">
      <Card className="mb-6 bg-white">
        <CardContent className="flex justify-between items-center p-4">
          <Button variant="outline" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}>
            Previous Month
          </Button>
          <h2 
            className="text-2xl font-bold cursor-pointer hover:underline text-gray-800"
            onClick={handleDateClick}
          >
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <Button variant="outline" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}>
            Next Month
          </Button>
        </CardContent>
      </Card>      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="font-bold text-center text-gray-600">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-4">
        {renderCalendar()}
      </div>

      <Dialog open={showDonationModal} onOpenChange={setShowDonationModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedDonation ? 'Edit Donation' : 'Create Donation'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Donation Title"
              value={newDonation.title}
              onChange={(e) => setNewDonation({ ...newDonation, title: e.target.value })}
              className="col-span-3"
            />
            <Input
              type="date"
              value={newDonation.date}
              onChange={(e) => setNewDonation({ ...newDonation, date: e.target.value })}
              className="col-span-3"
            />
            <Select
              value={newDonation.type}
              onValueChange={(value: DonationType) => setNewDonation({ ...newDonation, type: value })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select Donation Type" />
              </SelectTrigger>
              <SelectContent>
                {donationTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            {selectedDonation ? (
              <>
                <Button variant="outline" onClick={handleUpdateDonation}>Update</Button>
                <Button variant="destructive" onClick={handleDeleteDonation}>Delete</Button>
              </>
            ) : (
              <Button onClick={handleCreateDonation}>Create</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDateModal} onOpenChange={setShowDateModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select Month and Year</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Select value={months[selectedMonth]} onValueChange={handleMonthChange}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              value={selectedYear.toString()}
              onChange={handleYearChange}
              min={1900}
              max={2100}
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleDateSubmit}>Set Date</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cal;