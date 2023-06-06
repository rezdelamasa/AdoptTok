"use client";
import "./index.css"
import React, {EventHandler, useEffect, useState} from "react";
import {debounce} from "lodash";

export default function Page() {
  const [listings, setListings] = useState([
    {
      id: "1",
      name: "Sudo",
      breed: "Shiba Inu Mix",
      images: [
        "https://plus.unsplash.com/premium_photo-1668208365386-4198381c6f6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY4MjM4Njg2MQ&ixlib=rb-4.0.3&q=80&w=1080",
        "https://images.unsplash.com/photo-1567225591450-06036b3392a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY4MTMyMTEwNw&ixlib=rb-4.0.3&q=80&w=1080"
      ],
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
      id: "2",
      name: "Taki",
      breed: "Chihuahua",
      images: [
        "https://images.unsplash.com/photo-1607386176712-d8baeb6178a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY4NTg0MzQ4Nw&ixlib=rb-4.0.3&q=80&w=1080",
        "https://images.unsplash.com/photo-1514134136604-e14631dd3477?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY4NTg0MzUxNw&ixlib=rb-4.0.3&q=80&w=1080"
      ],
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
      id: "3",
      name: "Sudo",
      breed: "Shiba Inu Mix",
      images: [
        "https://plus.unsplash.com/premium_photo-1668208365386-4198381c6f6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY4MjM4Njg2MQ&ixlib=rb-4.0.3&q=80&w=1080",
        "https://images.unsplash.com/photo-1567225591450-06036b3392a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY4MTMyMTEwNw&ixlib=rb-4.0.3&q=80&w=1080"
      ],
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
      id: "4",
      name: "Taki",
      breed: "Chihuahua",
      images: [
        "https://images.unsplash.com/photo-1607386176712-d8baeb6178a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY4NTg0MzQ4Nw&ixlib=rb-4.0.3&q=80&w=1080",
        "https://images.unsplash.com/photo-1514134136604-e14631dd3477?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY4NTg0MzUxNw&ixlib=rb-4.0.3&q=80&w=1080"
      ],
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    }
  ])

  const [currentListingIndex, setCurrentListing] = useState(0);
  const [scrolling, setScrolling] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
    const currentImagesLength = listings[currentImageIndex].images.length - 1;
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

  useEffect(() => {
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

  function CurrentListingItem() {
    return (
        <div key={listings[currentListingIndex]?.id} className="listing">
          <div className="listing__images">
            <img src={listings[currentListingIndex]?.images[currentImageIndex]} alt={listings[currentListingIndex]?.breed}/>
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
    if(scrolling === "down") {
      return (
          <div key={listings[currentListingIndex + 1]?.id} className="listing--next">
            <div className="listing__images">
              <img src={listings[currentListingIndex + 1]?.images[0]} alt={listings[currentListingIndex + 1]?.breed}/>
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
    if(scrolling === "up") {
      return (
          <div key={listings[currentListingIndex - 1]?.id} className="listing--prev">
            <div className="listing__images">
              <img src={listings[currentListingIndex - 1]?.images[0]} alt={listings[currentListingIndex - 1]?.breed}/>
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
    const currentListingImagesLength = listings[currentListingIndex].images.length - 1;
    if(currentImageIndex < currentListingImagesLength) {
      return (
          <button className="button--next" onClick={() => handleButtonPress("next")}>&#62;</button>
      )
    }
    return;
  }

  function ImageButtons() {
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