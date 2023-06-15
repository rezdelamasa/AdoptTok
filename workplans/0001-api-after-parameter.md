API after date parameter

Currently, there is an issue with the pagination. As is, once you get to the end of the listings array, the page state will increment. A useEffect hook will then fetchAnimals because the page was updated and use the new page state for the page parameter. However, because we're grabbing nationwide listings without any other filters, by the time the initial 20 is scrolled through, it's possible that another 20 have been published already thus making the initial 20 we fetched on the first page on the second page now. This causes a duplicate iteration key error which also breaks the scrolling. 

To fix this, create a new state variable for a timestamp [afterTimestamp]. Then on initial fetch, set afterTimestamp equal to the published_at timestamp from the first listing in the results. The fetch will always use this as an anchor. Now newer listings won't be fetched, causing any listings that were already fetched to shift and thus re-fetched. 

pseudocode:

create a new state variable for the timestamp
~~~
const [afterTimestamp, setAfterTimestamp] = useState("")
~~~


after initial mount and fetch, once listings have been set, create another useEffect hook with listings as a dependency. There are also conditions so that the hook code will only run on the first fetch
~~~
useEffect(() => {
    if(listings.length && currentListingIndex === 0 && currentPageIndex === 0) {
        setAfterTimestamp(listings[0].publishedAt);
    }
}, [listings]);
~~~


then modify the fetch to use the after timestamp for the parameter
~~~
const fetchAnimals = (): void => {
    client.animal.search({
        page: currentListingsPage,
        after: afterTimestamp
    }).then(response => {
        setListings((previousValue: Animal[]) => {
            const allListings: Animal[] = [...previousValue, ...response.data.animals];
            return allListings.filter((item, index) => allListings.indexOf(item) === index);
        });
    })
    setLoading(false);
}
~~~