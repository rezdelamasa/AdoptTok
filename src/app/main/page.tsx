"use client";
import "./index.css"
import React, {EventHandler, useEffect, useState} from "react";
import {debounce} from "lodash";
import client from "@/api/client";


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
  const [listings, setListings] = useState<Animal[]>([])

  const [currentListingIndex, setCurrentListingIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentListingsPage, setCurrentListingsPage] = useState(1);

  function nextListing() {
    setCurrentListingIndex((prevIndex) => {
      if(prevIndex === listings.length - 1) {
        setCurrentListingsPage((prevPage: number) => {
          return ++prevPage;
        })
        nextListing();
      } else {
        return ++prevIndex;
      }
      return prevIndex;
    })
  }

  function prevListing() {
    setCurrentListingIndex((prevIndex) => {
      if(prevIndex > 0) {
        return --prevIndex;
      }
      return prevIndex;
    })

  }

  useEffect(() => {
    if(currentListingIndex === 0 && !listings.length) return;
    if(currentListingIndex === listings.length - 1) {
      setCurrentListingsPage((prevPage: number) => {
        return ++prevPage;
      })
    }
    scrollToListing();
  }, [currentListingIndex, listings]);

  const scrollToListing = () => {
    const nextListing: Animal = listings[currentListingIndex];
    const nextListingID: number = nextListing.id;
    const element = document.getElementById("" + nextListingID);
    if(element) {
      element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    }
  }

  const debouncedScroll =
      debounce((event) => {
        if(event.wheelDeltaY < 0) {
          nextListing();
        }
        if(event.wheelDeltaY > 0){
          prevListing();
        }
        setCurrentImageIndex(0);
      }, 500);

  const handleButtonPress = (dir: String) => {
    const currentListing: Animal | undefined = listings[currentListingIndex];
    let currentImagesLength: number;
    if(currentListing) {
      currentImagesLength = currentListing.photos.length - 1;
    }
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
          setListings(response.data.animals);
        })
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    fetchAnimals();
  }, []);

  useEffect(() => {
    const handleScroll: EventHandler<any> = (event) => {
      debouncedScroll(event);
    };

    window.addEventListener('mousewheel', handleScroll);

    return () => {
      window.removeEventListener('mousewheel', handleScroll);
    };
  }, [listings])

  type PhotoProps = {
    current: string,
    listing: Animal
  }

  function ListingPhoto({ current, listing } : PhotoProps) {
    let listingIndex = 0;
    if(current === 'current') {
      listingIndex = currentListingIndex
    } else if(current === 'next') {
      listingIndex = currentListingIndex + 1;
    } else if(current === 'prev') {
      listingIndex = currentListingIndex - 1;
    }
    if(!loading && listings.length) {
      if(listing.photos.length) {
        return (
            <img src={listing.photos[currentImageIndex]?.medium} alt={listing.name}/>
        )
      } else {
        return (
            <img src="" alt={listing.name}/>
        )
      }
    }
  }

  function Listings() {
    if(listings.length && !loading) {
      return (
        <div className="listings-wrapper">
          {listings.map((listing: Animal) => {
            return <Listing key={listing.id} {...listing}></Listing>
          })}
        </div>
      )
    }
  }

  function Listing(listing: Animal) {
    return (
      <div key={listing.id} id={listing.id + ''} className="listing">
        <div className="listing__images">
          <ListingPhoto listing={listing} current="current"></ListingPhoto>
        </div>
        <div className="listing__content p-6">
          <h1 className="mb-2 text-3xl font-bold">{listing.name}</h1>
          <h2 className="mb-2 text-2xl">{listing.breeds.primary}</h2>
          <p className="">{listing.description}</p>
        </div>
      </div>
    )
  }

  function PrevButton() {
    if(loading) return;
    if(currentImageIndex > 0) {
      return (
        <button className="button--prev shadow-md" onClick={() => handleButtonPress("prev")}>&#60;</button>
      )
    }
    return (
      <div className="button--placeholder"></div>
    )
  }

  function NextButton() {
    if(!loading && listings.length) {
      const currentListingImagesLength = listings[currentListingIndex].photos.length - 1;
      if(currentImageIndex < currentListingImagesLength) {
        return (
            <button className="button--next shadow-md" onClick={() => handleButtonPress("next")}>&#62;</button>
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
            <Listings></Listings>
          </div>
        </div>
      </main>
  )
}