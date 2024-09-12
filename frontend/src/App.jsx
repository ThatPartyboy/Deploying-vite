import React, {useState, useEffect} from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "./@/components/ui/dialog";
import {Input} from "./@/components/ui/input";
import {Button} from "./@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./@/components/ui/select";
import {Card, CardContent} from "./@/components/ui/card";

const donationTypes = [
    {
        value: "hygiene",
        label: "衛生用品",
        color: "bg-green-100 hover:bg-green-200 text-green-800",
    },
    {
        value: "food",
        label: "食物",
        color: "bg-orange-100 hover:bg-orange-200 text-orange-800",
    },
    {
        value: "clothing",
        label: "衣服",
        color: "bg-blue-100 hover:bg-blue-200 text-blue-800",
    },
    {
        value: "other",
        label: "其他",
        color: "bg-purple-100 hover:bg-purple-200 text-purple-800",
    },
];

const months = [
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月",
];

const times = [
    "10:00-10:30", "10:30-11:00", "11:00-11:30", "11:30-12:00", "12:00-12:30", "12:30-13:00", "13:00-13:30", "13:30-14:00", "14:00-14:30", "14:30-15:00", "15:00-15:30", "15:30-16:00",
    "16:00-16:30", "16:30-17:00", "17:00-17:30", "17:30-18:00", "18:00-18:30", "18:30-19:00", "19:00-19:30", "19:30-20:00", "20:00-20:30", "20:30-21:00", "21:00-21:30", "21:30-22:00"
];

const TimeDropdown = ({selectedTime, setSelectedTime}) => (
    <Select value={selectedTime} onValueChange={setSelectedTime}>
        <SelectTrigger>
            <SelectValue placeholder="選擇時間"/>
        </SelectTrigger>
        <SelectContent>
            {times.map((time) => (
                <SelectItem key={time} value={time}>
                    {time}
                </SelectItem>
            ))}
        </SelectContent>
    </Select>
);


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
        type: "食物",
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
        setNewDonation({title: "", date, type: "hygiene"});
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
            alert("請填入所有必填欄位");
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
                        前一個月
                    </Button>
                    <h2
                        className="text-2xl font-bold cursor-pointer hover:underline text-gray-800"
                        onClick={handleDateClick}
                    >
                        {currentDate.toLocaleString("zh-TW", {
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
                        下一個月
                    </Button>
                </CardContent>
            </Card>
            <div className="grid grid-cols-7 gap-1 mb-2">
                {["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"].map((day) => (
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
                            {selectedDonation ? "Edit Donation" : "填入基本訊息吧"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Input
                            placeholder="你的稱呼"
                            value={newDonation.name}
                            onChange={(e) =>
                                setNewDonation({...newDonation, name: e.target.value})
                            }
                            className="col-span-3"
                            required
                        />
                        <Input
                            placeholder="你的電話（我們會對訊息保密）"
                            value={newDonation.phone}
                            onChange={(e) =>
                                setNewDonation({...newDonation, phone: e.target.value})
                            }
                            className="col-span-3"
                            required
                        />
                        <Input
                            placeholder="你想捐什麽🤔"
                            value={newDonation.title}
                            onChange={(e) =>
                                setNewDonation({...newDonation, title: e.target.value})
                            }
                            className="col-span-3"
                            required
                        />
                        <div>
                            <div className="flex space-x-4 col-span-3">
                                <Input
                                    type="date"
                                    value={newDonation.date}
                                    onChange={(e) =>
                                        setNewDonation({...newDonation, date: e.target.value})
                                    }
                                    className="w-full"
                                    required
                                />
                                <TimeDropdown
                                    selectedTime={newDonation.time}
                                    setSelectedTime={(time) => {
                                        const updatedDonation = {...newDonation, time};
                                        setNewDonation(updatedDonation);
                                    }}
                                    className="w-full"
                                    required
                                />
                            </div>
                        </div>
                        <Select
                            value={newDonation.type}
                            onValueChange={(value) =>
                                setNewDonation({...newDonation, type: value})
                            }
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="選擇種類"/>
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
                            placeholder="數量"
                            type="number"
                            value={newDonation.amount}
                            onChange={(e) =>
                                setNewDonation({...newDonation, amount: e.target.value})
                            }
                            className="col-span-3"
                        />
                        <Input
                            placeholder="備註"
                            value={newDonation.note}
                            onChange={(e) =>
                                setNewDonation({...newDonation, note: e.target.value})
                            }
                            className="col-span-3"
                        />
                    </div>
                    <DialogFooter>
                        {selectedDonation ? (
                            <>
                                <Button variant="outline" onClick={handleUpdateDonation}>
                                    更新
                                </Button>
                                <Button variant="destructive" onClick={handleDeleteDonation}>
                                    刪除
                                </Button>
                            </>
                        ) : (
                            <Button onClick={handleCreateDonation}>新增</Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showDateModal} onOpenChange={setShowDateModal}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>選擇年份和月份</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Select
                            value={months[selectedMonth]}
                            onValueChange={handleMonthChange}
                        >
                            <SelectContent>
                                {months.map((month) => (
                                    <SelectItem key={month} value={month}>
                                        {month}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select Month"/>
                            </SelectTrigger>
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
                        <Button variant="destructive" onClick={handleDateSubmit}>確定</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};


export default Cal;
