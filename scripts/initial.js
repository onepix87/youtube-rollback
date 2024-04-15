// Trying to override yt initial related feed data before yt reads it

let initialCallback = () => {
    // Monkey patching initial data loading function in case when yt polymer script loaded faster.
    if (window.loadInitialData) {
        const { loadInitialData: origLoadInitialData } = window;

        window.loadInitialData = (initialData) => {
            if (initialData.response?.contents?.twoColumnWatchNextResults?.secondaryResults.secondaryResults.results[0].richGridRenderer) {
                let richResults = initialData.response.contents.twoColumnWatchNextResults.secondaryResults.secondaryResults.results[0].richGridRenderer;
                let compactResults = richResults.contents.map(resObj => (resObj.richItemRenderer ? { compactVideoRenderer: {...resObj.richItemRenderer.content.videoRenderer} } : resObj));

                initialData.response.contents.twoColumnWatchNextResults.secondaryResults.secondaryResults = { results: compactResults, targetId: richResults.targetId, trackingParams: richResults.trackingParams };
            }
            return origLoadInitialData(initialData);
        }
        clearInterval(initialIntervalId);
    }
    // Replacing rich related feed results with compact version in yt initial data.
    if (!window.loadInitialData && window.ytInitialData?.contents?.twoColumnWatchNextResults) {
        if (window.ytInitialData.contents.twoColumnWatchNextResults.secondaryResults.secondaryResults.results[0].richGridRenderer) {
            let richResults = window.ytInitialData.contents.twoColumnWatchNextResults.secondaryResults.secondaryResults.results[0].richGridRenderer;
            let compactResults = richResults.contents.map(resObj => (resObj.richItemRenderer ? { compactVideoRenderer: {...resObj.richItemRenderer.content.videoRenderer} } : resObj));

            window.ytInitialData.contents.twoColumnWatchNextResults.secondaryResults.secondaryResults = { results: compactResults, targetId: richResults.targetId, trackingParams: richResults.trackingParams };
        }
        clearInterval(initialIntervalId);
    }
}

initialIntervalId = setInterval(initialCallback, 4);