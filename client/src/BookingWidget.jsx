import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { differenceInCalendarDays } from "date-fns";

export default function BookingWidget(place){
    const [checkIn,setCheckIn]=useState('');
    const [checkOut,setCheckOut]=useState('');
    const [numberofGuests,setNumberofGuests]=useState(1);
    const [name,setName]=useState('');
    const [phone,setPhone]=useState('');
    const [redirect,setRedirect]=useState('');
    const {user}=useContext(UserContext);

    useEffect(()=>{
        if(user){
            setName(user.name);
        }
    },[user]);

    let numberofNights=0;
    if(checkIn && checkOut){
        numberofNights=differenceInCalendarDays(new Date(checkOut,new Date(checkIn)));
    }

    async function bookThisPlace() {
        const response=await axios.post('/bookings',{
            checkIn,checkOut,numberofGuests,name,phone,
            place:place._id,
            price:numberofNights*place.price,
        });
        const bookingId=response.data._id;
        setRedirect(`/account/bookings/${bookingId}`);
    }

    if(redirect){
        return <Navigate to={redirect}/>
    }

    return(
        <div className=" bg-white shadow p-4  rounded-2xl">
            <div className=" text-2xl text-center">
            Price: ${place.price} / per night
            </div>
            <div className=" border rounded-2xl mt-4">
                <div className=" flex">
                    <div className=" py-3 px-4">
                        <label>Check in:</label>
                        <input type="date"
                        value={checkIn}
                        onChange={ev=> setCheckIn(ev.target.value)} 
                        />
                    </div>
                    <div className=" py-3 px-4 border-l">
                        <label>Check out:</label>
                        <input type="date"
                        value={checkOut}
                        onChange={ev=> setCheckOut(ev.target.value)}
                         />
                    </div>
                    <div className=" py-3 px-4 border-t">
                        <label>Number of guests:</label>
                        <input type="number"
                        value={numberofGuests}
                        onChange={ev=> setNumberofGuests(ev.target.value)} 
                        />
                    </div>
                    { numberofNights >0 && (
                        <div className=" py-3 px-4 border-t">
                        <label>your full name:</label>
                        <input type="text"
                        value={name}
                        onChange={ev=> setName(ev.target.value)} />
                        <label>phone number:</label>
                        <input type="tel"
                        value={phone}
                        onChange={ev=> setPhone(ev.target.value)} />
                    </div>
                    )}
                    <button className=" primary mt-4"
                    onClick={bookThisPlace}
                     >
                        Book this place
                        {numberofNights >0 &&(
                            <span> ${numberofNights*place.price}</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}