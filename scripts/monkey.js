// Monkey patching fetch api to replace rich item with compact version
console.warn('Fetch API is being patched by youtube extension!');

const { fetch: origFetch } = window;
window.fetch = async (...args) => {
    const response = await origFetch(...args);
    if (response.url.includes('youtubei/v1/next')) {
        let body = await response.json();
        const options = { status: response.status, statusText: response.statusText, headers: response.headers };

        if (body.onResponseReceivedEndpoints.some(endpoint => (endpoint.appendContinuationItemsAction || {}).targetId === 'watch-next-feed')) {
            let relatedFeedIndex = body.onResponseReceivedEndpoints.findIndex(endpoint => (endpoint.appendContinuationItemsAction || {}).targetId === 'watch-next-feed');
            let newRelatedFeedArray = body.onResponseReceivedEndpoints[relatedFeedIndex].appendContinuationItemsAction.continuationItems.map(renderObj => (renderObj.richItemRenderer ? { compactVideoRenderer: {...renderObj.richItemRenderer.content.videoRenderer} } : renderObj));
            body.onResponseReceivedEndpoints[relatedFeedIndex].appendContinuationItemsAction.continuationItems = newRelatedFeedArray;
        }

        if (body.contents && body.contents.twoColumnWatchNextResults?.secondaryResults?.secondaryResults?.results[0].richGridRenderer) {
            let richResults = body.contents.twoColumnWatchNextResults.secondaryResults.secondaryResults.results[0].richGridRenderer;
            let compactResults = richResults.contents.map(resObj => (resObj.richItemRenderer ? { compactVideoRenderer: {...resObj.richItemRenderer.content.videoRenderer} } : resObj));

            body.contents.twoColumnWatchNextResults.secondaryResults.secondaryResults = { results: compactResults, targetId: richResults.targetId, trackingParams: richResults.trackingParams };
        }

        return new Response(JSON.stringify(body), options);
    }

    return response;
};