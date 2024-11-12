import { useEffect, useState } from "react"
import Header from "../Header"
import axios from "axios";
import { Link } from "react-router-dom";

export default function IndexPage(){
    const [places,setPlaces]=useState([]);
    useEffect(()=>{
      axios.get('/places').then(response=>{
        // console.log(response.data+"jdkjgkgf")
        setPlaces(response.data);
      });
    },[]);
    // console.log("palces len " + places.length)
  return(
    <div className=" mt-8 grid gap-x-6 gap-y-8 grid-row-2 md:grid-row-3 lg:grid-row-3 text-center">
          <Header/>
          {places.length >0 && places.map(place=>(
            <Link to={'/place/'+place._id} key={place._id}>
              <div className=" bg-gray-500 mb-2 rounded-2xl flex"> 
              {place.photos?.[0] &&(
                <img className=" rounded-2xl object-cover aspect-square" src={"http://localhost:4000/uploads/"+place.photos[0]} alt="" />
              )}
              </div>
              <h2 className=" font-bold">{place.address}</h2>
              <h3 className=" text-sm text-gray-500">{place.title}</h3>
              <div className=" mt-1">
                <span className=" font-bold">${place.price}</span> per night
              </div>
            </Link>
          ))}
      </div>
    );
}