import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputNumber } from 'primereact/inputnumber';
import Layout from '@/Layouts/layout/layout.jsx';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';
import { AutoComplete } from 'primereact/autocomplete';

export default function TripForm() {
    const { trip, mode } = usePage().props;
    const isEdit = mode === 'edit';
    const [pickupSuggestions, setPickupSuggestions] = useState([]);
    const [destinationSuggestions, setDestinationSuggestions] = useState([]);
    // const [selectedPickupPoint, setSelectedPickupPoint] = useState(isEdit ? trip.pickup_point : '');
    // const [selectedDestination, setSelectedDestination] = useState(isEdit ? trip.destination : '');

    const { data, setData, get, post, put, processing, errors } = useForm({
        vehicle_type: isEdit ? trip.vehicle_type : '',
        total_no_of_slots: isEdit ? trip.total_no_of_slots : '',
        pickup_point: isEdit ? trip.pickup_point : '',
        destination: isEdit ? trip.destination : '',
        start_time: isEdit ? new Date(trip.start_time) : null,
    });

    const vehicleTypes = [
        { label: 'Cab', value: 'Cab' },
        { label: 'Auto', value: 'Auto' },
        { label: 'Bike', value: 'Bike' },
        { label: 'Bus', value: 'Bus' },
    ];

    
    const fetchSuggestions = async (type, query) => {
        if (query.length < 3) {
            if (type === 'pickup') {
                setPickupSuggestions([]);
            } else {
                setDestinationSuggestions([]);
            }
            return; // Avoid calling API for short queries
        }
        try {
            const encodedAddress = encodeURIComponent(query);
            const response = await axios.get(('/scrape?search='+encodedAddress));
            const suggestions = response.data; // Convert object to array
            if (type === 'pickup') {
                setPickupSuggestions(suggestions);
            } else {
                setDestinationSuggestions(suggestions);
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };
    

    const handlePickupChange = (e) => {
        const value = e.query;
        setData({ ...data, pickup_point: value });
        fetchSuggestions('pickup', value);
    };

    const handleDestinationChange = (e) => {
        const value = e.query;
        setData({ ...data, destination: value });
        fetchSuggestions('destination', value);
    };


    const submitForm = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('trip.update', trip.id));
        } else {
            post(route('trip.store'));
        }
    };
    const [calendarVisible, setCalendarVisible] = useState(false);
    return (
        <Layout>
            <div className="flex justify-content-center">
                <Card className="p-4" style={{ width: '500px' }}>
                    <h2 className="text-center mb-4">
                        <i className="pi pi-car mr-2"></i>{isEdit ? 'Edit Trip' : 'Create New Trip'}
                    </h2>
                    <form onSubmit={submitForm} className="p-fluid">
                        <div className="field mb-3">
                            <span className="p-input-icon-left">
                                <i className="pi pi-truck"></i>
                                <Dropdown
                                    id="vehicle_type"
                                    value={data.vehicle_type}
                                    onChange={(e) => setData({ ...data, vehicle_type: e.value })}
                                    options={vehicleTypes}
                                    placeholder="Select Vehicle Type"
                                    required
                                    className={errors.vehicle_type ? 'p-invalid' : ''}
                                />
                            </span>
                            {errors.vehicle_type && <small className="p-error">{errors.vehicle_type}</small>}
                        </div>

                        <div className="field mb-3">
                            <span className="p-input-icon-left">
                                <InputNumber
                                    id="total_no_of_slots"
                                    value={data.total_no_of_slots}
                                    onValueChange={(e) => setData('total_no_of_slots', e.value)}
                                    placeholder="Total No. of Sits Available"
                                    required
                                    className={errors.total_no_of_slots ? 'p-invalid' : ''}
                                />
                            </span>
                            {errors.total_no_of_slots && <small className="p-error">{errors.total_no_of_slots}</small>}
                        </div>

                        <div className="field mb-3">
                            <span className="p-input-icon-left">
                                <i className="pi pi-map-marker"></i>
                                <AutoComplete
                                    value={data.pickup_point}
                                    suggestions={pickupSuggestions} // Display fetched suggestions
                                    completeMethod={handlePickupChange} // Method to fetch suggestions
                                    onChange={(e) => setData({ ...data, pickup_point: e.value })} // Handle selection
                                    placeholder="Search Pickup Point"
                                    onSelect={(e) => {
                                        setData({ ...data, pickup_point: e.value });
                                        // setSelectedPickupPoint(e.value)
                                    }
                                    }
                                    // dropdown // Optional dropdown icon for manual search
                                />
                            </span>
                            {errors.pickup_point && <small className="p-error">{errors.pickup_point}</small>}
                        </div>

                        <div className="field mb-3">
                            <span className="p-input-icon-left">
                                <i className="pi pi-map"></i>
                                <AutoComplete
                                    value={data.destination}
                                    suggestions={destinationSuggestions} // Display fetched suggestions
                                    completeMethod={handleDestinationChange} // Method to fetch suggestions
                                    onChange={(e) => setData({ ...data, destination: e.value })} // Handle selection
                                    placeholder="Search Destination Point"
                                    onSelect={(e) => setData({ ...data, destination: e.value })}
                                    // dropdown // Optional dropdown icon for manual search
                                />
                                {/* <InputText
                                    id="destination"
                                    value={data.destination}
                                    onChange={handleDestinationChange}
                                    placeholder="Destination"
                                    required
                                    className={errors.destination ? 'p-invalid' : ''}
                                    list="destination-options" // Using datalist for suggestions
                                /> */}
                            </span>
                            {errors.destination && <small className="p-error">{errors.destination}</small>}
                            
                        </div>

                        <div className="field mb-3">
                            <span className="p-input-icon-left">
                                <i className="pi pi-calendar"></i>
                                <Calendar
                                    id="start_time"
                                    value={data.start_time}
                                    onChange={(e) => setData('start_time', e.value)}
                                    showTime
                                    hourFormat="12"
                                    placeholder="Start Time"
                                    required
                                    className={errors.start_time ? 'p-invalid' : ''}
                                    minDate={new Date()}
                                    visible={calendarVisible}
                                    onClick={() => setCalendarVisible(true)} // Show calendar when clicked
                                    hideOnDateTimeSelect={true}
                                />
                            </span>
                            {errors.start_time && <small className="p-error">{errors.start_time}</small>}
                        </div>

                        <div className="text-center">
                            <Button
                                type="submit"
                                label={isEdit ? "Update" : "Create"}
                                icon="pi pi-check"
                                className="p-button-success p-button-lg"
                                loading={processing}
                            />
                        </div>
                    </form>
                </Card>
            </div>

            {/* <style jsx>{`
                .suggestions {
                    list-style-type: none;
                    padding: 0;
                    margin: 0;
                    border: 1px solid #ccc;
                    max-height: 150px;
                    overflow-y: auto;
                    position: absolute;
                    z-index: 1000;
                    background-color: white;
                }

                .suggestions li {
                    padding: 10px;
                    cursor: pointer;
                }

                .suggestions li:hover {
                    background-color: #f0f0f0;
                }
            `}</style> */}
        </Layout>
    );
}
