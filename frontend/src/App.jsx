import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

const donationTypes = [
  {
    value: "hygiene",
    label: "Hygiene",
    color: "bg-green-100 hover:bg-green-200 text-green-800",
  },
  {
    value: "food",
    label: "Food",
    color: "bg-orange-100 hover:bg-orange-200 text-orange-800",
  },
  {
    value: "clothing",
    label: "Clothing",
    color: "bg-blue-100 hover:bg-blue-200 text-blue-800",
  },
  {
    value: "medical",
    label: "Medical Supplies",
    color: "bg-red-100 hover:bg-red-200 text-red-800",
  },
  {
    value: "volunteer",
    label: "Volunteer Time",
    color: "bg-purple-100 hover:bg-purple-200 text-purple-800",
  },
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const api = "http://localhost:5001/api/donations";

const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

const Cal = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [donations, setDonations] = useState([]);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [newDonation, setNewDonation] = useState({
    title: "",
    date: "",
    type: "hygiene",
    amount: "",
    note: "",
  });
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());

  useEffect(() => {
    fetch(api)
      .then((response) => response.json())
      .then((data) => setDonations(data))
      .catch((error) => console.error("Error fetching donations:", error));
  }, []);

  console.log(donations);

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
      const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
      const dayDonations = donations.filter(
        (donation) => donation.date === date
      );
      const isToday =
        new Date().toDateString() === new Date(date).toDateString();

      calendarDays.push(
        <Card
          key={day}
          className={`min-h-[120px] cursor-pointer hover:shadow-lg transition-shadow duration-200 ${
            isToday ? "border-2 border-blue-500" : ""
          }`}
          onClick={() => handleSelectDay(date)}
        >
          <CardContent className="p-2">
            <div
              className={`font-bold text-right ${
                isToday ? "text-blue-500" : "text-gray-600"
              }`}
            >
              {day}
            </div>
            {dayDonations.map((donation, index) => {
              const donationType = donationTypes.find(
                (t) => t.value === donation.type
              );
              return (
                <div
                  key={index}
                  className={`${
                    donationType ? donationType.color : ""
                  } p-2 mb-1 rounded-md text-sm cursor-pointer transition-colors duration-200 truncate`}
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

  const handleSelectDay = (date) => {
    setNewDonation({ title: "", date, type: "hygiene" });
    setSelectedDonation(null);
    setShowDonationModal(true);
  };

  const handleSelectDonation = (e, donation) => {
    e.stopPropagation();
    setSelectedDonation(donation);
    setNewDonation(donation);
    setShowDonationModal(true);
  };

  const checkInputFIlled = () => {
    if (!newDonation.title || !newDonation.date || !newDonation.amount) {
      alert("Please fill out all required fields.");
      return false;
    }
    return true;
  };

  const handleCreateDonation = () => {
    if (!checkInputFIlled()) return;

    fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newDonation),
    })
      .then((response) => response.json())
      .then((data) => {
        setDonations([...donations, data]);
        setShowDonationModal(false);
      })
      .catch((error) => {
        console.error("Error creating donation:", error);
      });
  };

  const handleUpdateDonation = () => {
    if (!checkInputFIlled()) return;
    
    fetch(`${api}/${selectedDonation._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newDonation),
    })
      .then((response) => response.json())
      .then((data) => {
        
        const updatedDonations = donations.map((donation) =>
          donation._id === selectedDonation._id ? data : donation
        );
        setDonations(updatedDonations);
        setShowDonationModal(false);
      })
      .catch((error) => {
        console.error("Error updating donation:", error);
      });
  };

  const handleDeleteDonation = () => {
    const updatedDonations = donations.filter(
      (donation) => donation !== selectedDonation
    );

    fetch(`${api}/${selectedDonation._id}`, {
      method: "DELETE",
    })
      .then(() => {
        setDonations(updatedDonations);
        setShowDonationModal(false);
      })
      .catch((error) => {
        console.error("Error deleting donation:", error);
      });
  };

  const handleDateClick = () => {
    setSelectedYear(currentDate.getFullYear());
    setSelectedMonth(currentDate.getMonth());
    setShowDateModal(true);
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  const handleMonthChange = (value) => {
    setSelectedMonth(months.indexOf(value));
  };

  const handleDateSubmit = () => {
    setCurrentDate(new Date(selectedYear, selectedMonth, 1));
    setShowDateModal(false);
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-lg">
      <Card className="mb-6 bg-white">
        <CardContent className="flex justify-between items-center p-4">
          <Button
            variant="outline"
            onClick={() =>
              setCurrentDate(
                new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth() - 1,
                  1
                )
              )
            }
          >
            Previous Month
          </Button>
          <h2
            className="text-2xl font-bold cursor-pointer hover:underline text-gray-800"
            onClick={handleDateClick}
          >
            {currentDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <Button
            variant="outline"
            onClick={() =>
              setCurrentDate(
                new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth() + 1,
                  1
                )
              )
            }
          >
            Next Month
          </Button>
        </CardContent>
      </Card>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="font-bold text-center text-gray-600">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-4">{renderCalendar()}</div>

      <Dialog open={showDonationModal} onOpenChange={setShowDonationModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedDonation ? "Edit Donation" : "Create Donation"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Donation Title"
              value={newDonation.title}
              onChange={(e) =>
                setNewDonation({ ...newDonation, title: e.target.value })
              }
              className="col-span-3"
            />
            <Input
              type="date"
              value={newDonation.date}
              onChange={(e) =>
                setNewDonation({ ...newDonation, date: e.target.value })
              }
              className="col-span-3"
            />
            <Select
              value={newDonation.type}
              onValueChange={(value) =>
                setNewDonation({ ...newDonation, type: value })
              }
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
            <Input
              placeholder="Amount"
              type="number"
              value={newDonation.amount}
              onChange={(e) =>
                setNewDonation({ ...newDonation, amount: e.target.value })
              }
              className="col-span-3"
            />
            <Input
              placeholder="Note"
              value={newDonation.note}
              onChange={(e) =>
                setNewDonation({ ...newDonation, note: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            {selectedDonation ? (
              <>
                <Button variant="outline" onClick={handleUpdateDonation}>
                  Update
                </Button>
                <Button variant="destructive" onClick={handleDeleteDonation}>
                  Delete
                </Button>
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
            <Select
              value={months[selectedMonth]}
              onValueChange={handleMonthChange}
            >
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
