"use client";
import "./index.css"
import React, {EventHandler, useEffect, useState} from "react";
import {debounce} from "lodash";
import axios from "axios";
import client from "@/api/client.ts";

const pfBaseUrl = "http://localhost:3000/";

type Animal = {
  "id": number,
  "organization_id": string,
  "url": string,
  "type": string,
  "species": string,
  "breeds": {
    "primary": string,
    "secondary": string,
    "mixed": boolean,
    "unknown": boolean
  },
  "colors": {
    "primary": string,
    "secondary": string,
    "tertiary": string
  },
  "age": string,
  "gender": string,
  "size": string,
  "coat": string,
  "name": string,
  "description": string,
  "photos": [
    {
      "small": string,
      "medium": string,
      "large": string,
      "full": string
    }
  ],
  "videos": [
    {
      "embed": string
    }
  ],
  "status": string,
  "attributes": {
    "spayed_neutered": boolean,
    "house_trained": boolean,
    "declawed": boolean,
    "special_needs": boolean,
    "shots_current": boolean
  },
  "environment": {
    "children": boolean,
    "dogs": boolean,
    "cats": boolean
  },
  "tags": string[],
  "contact": {
    "email": string,
    "phone": string,
    "address": {
      "address1": string,
      "address2": string,
      "city": string,
      "state": string,
      "postcode": string,
      "country": string
    }
  },
  "published_at": string,
    "distance": number,
  "_links": {
    "self": {
      "href": string
    },
    "type": {
      "href": string
    },
    "organization": {
      "href": string
    }
  }
}

export default function Page() {
  const [listings, setListings] = useState([])

  const [currentListingIndex, setCurrentListing] = useState(0);
  const [scrolling, setScrolling] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const debouncedScroll =
      debounce((event) => {
        if(event.wheelDeltaY < 0) {
          setCurrentListing(previousValue => {
            if(previousValue < listings.length - 1) {
              return ++previousValue
            }
            return previousValue;
          })
        }
        if(event.wheelDeltaY > 0){
          setCurrentListing(previousValue => {
            if(previousValue > 0) {
              return --previousValue;
            }
            return previousValue;
          })
        }
        setScrolling("");
        setCurrentImageIndex(0);
      }, 1000);

  const handleButtonPress = (dir: String) => {
    const currentImagesLength = listings[currentImageIndex].photos.length - 1;
    setCurrentImageIndex(previousValue => {
      if(dir ===  "next" && previousValue < currentImagesLength) {
        return previousValue + 1;
      }
      if(dir === "prev" && previousValue > 0) {
        return previousValue - 1;
      }
      return previousValue;
    })
  }

  const fetchAnimals = (): void => {
    // setLoading(true)
    client.animal.search()
        .then(response => {
          console.log(response);
          setListings(response.data.animals);
        })
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    fetchAnimals();

    const handleScroll: EventHandler<any> = (event) => {
      let listing = document.querySelector(".listing");
      let nextListing = document.querySelector(".listing--next");
      let prevListing = document.querySelector(".listing--prev");
      if(event.wheelDeltaY < 0) {
        setScrolling("down");
        setCurrentListing(previousValue => {
          if(previousValue < listings.length - 1) {
            if(listing) {
              listing.className = "listing scrolling--down";
            }

            if(nextListing) {
              nextListing.className = "listing--next scrolling--down"
            }
          }
          return previousValue;
        })
      }

      if(event.wheelDeltaY > 0) {
        setScrolling("up");
        setCurrentListing(previousValue => {
          if(previousValue > 0) {
            if(listing) {
              listing.className = "listing scrolling--up";
            }

            if(prevListing) {
              prevListing.className = "listing--prev scrolling--up"
            }
          }
          return previousValue;
        })
      }

      debouncedScroll(event);
    };

    window.addEventListener('mousewheel', handleScroll);

    return () => {
      window.removeEventListener('mousewheel', handleScroll);
    };
  }, []);

  function ListingPhoto(listing: string) {
    let listingIndex = 0;
    if(listing === 'current') {
      listingIndex = currentListingIndex
    } else if(listing === 'next') {
      listingIndex = currentListingIndex + 1;
    } else if(listing === 'prev') {
      listingIndex = currentListingIndex - 1;
    }
    if(!loading && listings.length) {
      if(listings[currentListingIndex].photos.length) {
        return (
            <img src={listings[listingIndex]?.photos[currentImageIndex]?.medium} alt={listings[listingIndex]?.breed}/>
        )
      } else {
        return (
            <img src="" alt={listings[listingIndex]?.breed}/>
        )
      }
    }
  }

  function CurrentListingItem() {
    if(loading) return;
    return (
        <div key={listings[currentListingIndex]?.id} className="listing">
          <div className="listing__images">
            <ListingPhoto listing='current'></ListingPhoto>
          </div>
          <div className="listing__content p-6">
            <h1 className="mb-2 text-3xl font-bold">{listings[currentListingIndex]?.name}</h1>
            <h2 className="mb-2 text-2xl">{listings[currentListingIndex]?.breed}</h2>
            <p className="">{listings[currentListingIndex]?.text}</p>
          </div>
        </div>
    )
  }

  function NextListingItem() {
    // if(loading) return;
    if(scrolling === "down") {
      return (
          <div key={listings[currentListingIndex + 1]?.id} className="listing--next">
            <div className="listing__images">
              <ListingPhoto listing='next'></ListingPhoto>
            </div>
            <div className="listing__content p-6">
              <h1 className="mb-2 text-3xl font-bold">{listings[currentListingIndex + 1]?.name}</h1>
              <h2 className="mb-2 text-2xl">{listings[currentListingIndex + 1]?.breed}</h2>
              <p className="">{listings[currentListingIndex + 1]?.text}</p>
            </div>
          </div>
      )
    }
  }

  function PreviousListingItem() {
    if(loading) return;
    if(scrolling === "up") {
      return (
          <div key={listings[currentListingIndex - 1]?.id} className="listing--prev">
            <div className="listing__images">
              <ListingPhoto listing='prev'></ListingPhoto>
            </div>
            <div className="listing__content p-6">
              <h1 className="mb-2 text-3xl font-bold">{listings[currentListingIndex - 1]?.name}</h1>
              <h2 className="mb-2 text-2xl">{listings[currentListingIndex - 1]?.breed}</h2>
              <p className="">{listings[currentListingIndex - 1]?.text}</p>
            </div>
          </div>
      )
    }
  }

  function PrevButton() {
    if(loading) return;
    if(currentImageIndex > 0) {
      return (
        <button className="button--prev" onClick={() => handleButtonPress("prev")}>&#60;</button>
      )
    }
    return (
      <div className="button--placeholder"></div>
    )
  }

  function NextButton() {
    if(!loading && listings.length) {
      console.log(listings[currentListingIndex]);
      const currentListingImagesLength = listings[currentListingIndex].photos.length - 1;
      if(currentImageIndex < currentListingImagesLength) {
        return (
            <button className="button--next" onClick={() => handleButtonPress("next")}>&#62;</button>
        )
      }
    }
  }

  function ImageButtons() {
    if(loading) return;
    return (
      <div className={scrolling ? "buttons buttons--scrolling" : "buttons"}>
        <PrevButton></PrevButton>
        <NextButton></NextButton>
      </div>
    )
  }

  return (
      <main>
        <div className="screen shadow-2xl">
          <div className="wrapper">
            <ImageButtons></ImageButtons>
            <PreviousListingItem></PreviousListingItem>
            <CurrentListingItem></CurrentListingItem>
            <NextListingItem></NextListingItem>
          </div>
        </div>
      </main>
  )
}