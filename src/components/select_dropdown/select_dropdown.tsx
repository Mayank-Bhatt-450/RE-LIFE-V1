import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { print } from '../../utilites/logger';
interface SelectProps {
    options: string[];
    placeholder?: string;
    defaultValue?: string;
    onChange: (value: string) => void;
    onClickOutside: (value: string) => void;
}

const Select: React.FC<SelectProps> = ({
    options,
    placeholder = 'Select an option',
    defaultValue = '',
    onChange,
    // onClickOutside 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(defaultValue || '');
    const [filteredOptions, setFilteredOptions] = useState(options);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    print('### Select', { 'options': options, "placeholder": placeholder, "defaultValue": defaultValue })
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {

            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                print('### Select # handleClickOutside', { 'event': event })
            }
            // onClickOutside()
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (isOpen) {
            filterOptions(inputValue);
        }
    }, [isOpen, inputValue]);

    const filterOptions = (value: string) => {
        print('### Select # filterOptions', { 'value': value, 'options': options })
        if (value.trim() === '') {
            setFilteredOptions(options);
        } else {
            setFilteredOptions(options.filter(option =>
                option.toLowerCase().includes(value.toLowerCase())
            ));
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        print('### Select # handleInputChange', { 'e': e })
        const value = e.target.value.toUpperCase();
        setInputValue(value);
        filterOptions(value);
        onChange(value);
    };

    const handleOptionClick = (option: string) => {
        print('### Select # handleOptionClick', { 'option': option })
        setInputValue(option);
        setIsOpen(false);
        onChange(option);
    };

    const handleInputFocus = () => {
        print('### Select # handleInputFocus', { 'inputValue': inputValue, 'options': options })
        setIsOpen(true);
        if (inputValue.trim() === '') {
            setFilteredOptions(options);
        } else {
            filterOptions(inputValue);
        }
    };

    return (
        <div className="dropdown" ref={dropdownRef}>
            <div className="input-group">
                <input
                    ref={inputRef}
                    type="text"
                    className="form-control"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    placeholder={placeholder}
                    aria-label={placeholder}
                    aria-describedby="basic-addon2"
                />
                <div className="input-group-append">
                    <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        ▼
                    </button>
                </div>
            </div>
            {isOpen && (
                <ul className="dropdown-menu show w-100">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option, index) => (
                            <li key={index}>
                                <button
                                    className="dropdown-item"
                                    type="button"
                                    onClick={() => handleOptionClick(option)}
                                >
                                    {option}
                                </button>
                            </li>
                        ))
                    ) : (
                        <li><span className="dropdown-item-text">No matching options</span></li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default Select;