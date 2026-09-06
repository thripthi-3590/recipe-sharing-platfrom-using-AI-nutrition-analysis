import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from 'lucide-react';

const DatePicker = ({ selectedDate, onSelect, onClose }) => {
    const [viewDate, setViewDate] = useState(new Date(selectedDate || new Date()));
    const [mode, setMode] = useState('days'); // 'days', 'months', 'years'

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const handleMonthChange = (offset) => {
        const newDate = new Date(viewDate);
        if (mode === 'days') {
            newDate.setMonth(newDate.getMonth() + offset);
        } else if (mode === 'years') {
            newDate.setFullYear(newDate.getFullYear() + (offset * 12));
        }
        setViewDate(newDate);
    };

    const handleSelectDay = (day) => {
        const result = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        onSelect(result);
    };

    const handleSelectMonth = (monthIdx) => {
        const newDate = new Date(viewDate);
        newDate.setMonth(monthIdx);
        setViewDate(newDate);
        setMode('days');
    };

    const handleSelectYear = (year) => {
        const newDate = new Date(viewDate);
        newDate.setFullYear(year);
        setViewDate(newDate);
        setMode('months');
    };

    const renderDays = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const totalDays = daysInMonth(year, month);
        const startDay = firstDayOfMonth(year, month);
        const daySlots = [];

        // Padding for first day
        for (let i = 0; i < startDay; i++) {
            daySlots.push(<div key={`pad-${i}`} className="h-10 w-10"></div>);
        }

        for (let d = 1; d <= totalDays; d++) {
            const isSelected = selectedDate &&
                selectedDate.getDate() === d &&
                selectedDate.getMonth() === month &&
                selectedDate.getFullYear() === year;
            const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();

            daySlots.push(
                <button
                    key={d}
                    onClick={() => handleSelectDay(d)}
                    className={`h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all
                        ${isSelected ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110' :
                            isToday ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    {d}
                </button>
            );
        }

        return (
            <div className="grid grid-cols-7 gap-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(s => (
                    <div key={s} className="h-10 w-10 flex items-center justify-center text-[10px] font-black text-gray-400 uppercase tracking-widest">{s}</div>
                ))}
                {daySlots}
            </div>
        );
    };

    const renderMonths = () => {
        return (
            <div className="grid grid-cols-3 gap-3 p-2">
                {months.map((m, i) => (
                    <button
                        key={m}
                        onClick={() => handleSelectMonth(i)}
                        className={`py-4 rounded-2xl text-sm font-bold transition-all
                            ${viewDate.getMonth() === i ? 'bg-primary/20 text-primary' : 'text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-100'}`}
                    >
                        {m.substring(0, 3)}
                    </button>
                ))}
            </div>
        );
    };

    const renderYears = () => {
        const startYear = viewDate.getFullYear() - 5;
        const years = Array.from({ length: 12 }, (_, i) => startYear + i);
        return (
            <div className="grid grid-cols-3 gap-3 p-2">
                {years.map(y => (
                    <button
                        key={y}
                        onClick={() => handleSelectYear(y)}
                        className={`py-4 rounded-2xl text-sm font-bold transition-all
                            ${viewDate.getFullYear() === y ? 'bg-primary/20 text-primary' : 'text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-100'}`}
                    >
                        {y}
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden w-[340px] animate-in fade-in zoom-in duration-300">
            <header className="p-6 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => setMode(mode === 'years' ? 'days' : 'years')}
                        className="flex items-center gap-2 group"
                    >
                        <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:bg-primary group-hover:text-white transition-all">
                            <CalendarIcon size={16} />
                        </div>
                        <span className="text-sm font-black text-gray-900 uppercase tracking-widest group-hover:text-primary transition-colors">Select Date</span>
                    </button>
                    {onClose && (
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                            <X size={20} />
                        </button>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <button onClick={() => handleMonthChange(-1)} className="p-2 text-gray-400 hover:text-primary hover:bg-white rounded-xl transition-all shadow-sm">
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex gap-1.5 overflow-hidden">
                        <button
                            onClick={() => setMode('months')}
                            className="font-serif text-lg font-black text-gray-900 hover:text-primary transition-colors"
                        >
                            {months[viewDate.getMonth()]}
                        </button>
                        <button
                            onClick={() => setMode('years')}
                            className="font-serif text-lg font-black text-gray-400 hover:text-primary transition-colors"
                        >
                            {viewDate.getFullYear()}
                        </button>
                    </div>
                    <button onClick={() => handleMonthChange(1)} className="p-2 text-gray-400 hover:text-primary hover:bg-white rounded-xl transition-all shadow-sm">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </header>

            <div className="p-4 min-h-[300px] flex items-center justify-center">
                {mode === 'days' && renderDays()}
                {mode === 'months' && renderMonths()}
                {mode === 'years' && renderYears()}
            </div>
        </div>
    );
};

export default DatePicker;
