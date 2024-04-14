// Trying to override yt experiment flags and initial related feed data before yt reads it

let experimentsIntervalId, initialIntervalId;
let experimentsCallback = () => {
    if (window.yt?.config_?.EXPERIMENT_FLAGS) {
        if (window.yt.config_.EXPERIMENT_FLAGS.kevlar_watch_grid) {
            delete window.yt.config_.EXPERIMENT_FLAGS.kevlar_watch_grid;
            delete window.yt.config_.EXPERIMENT_FLAGS.kevlar_watch_grid_hide_chips;
            delete window.yt.config_.EXPERIMENT_FLAGS.kevlar_watch_grid_reduced_top_margin_rich_grid;
            delete window.yt.config_.EXPERIMENT_FLAGS.swatcheroo_direct_use_rich_grid;
            window.yt.config_.EXPERIMENT_FLAGS.swatcheroo_rich_grid_delay = 0;
            window.yt.config_.EXPERIMENT_FLAGS.kevlar_watch_max_player_width = 1280;
            window.yt.config_.EXPERIMENT_FLAGS.kevlar_watch_grid_sidebar_min_width = 300;
            window.yt.config_.EXPERIMENT_FLAGS.kevlar_watch_two_column_width_threshold = 1000;
            window.yt.config_.EXPERIMENT_FLAGS.kevlar_watch_player_min_height = 360;
            window.yt.config_.EXPERIMENT_FLAGS.kevlar_watch_flexy_metadata_height = 136;
            window.yt.config_.EXPERIMENT_FLAGS.kevlar_watch_page_horizontal_margin = 24;
            window.yt.config_.EXPERIMENT_FLAGS.kevlar_watch_page_columns_top_padding = 24;
            window.yt.config_.EXPERIMENT_FLAGS.kevlar_watch_secondary_width = 400;
        }
        clearInterval(experimentsIntervalId);
    }
};

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
experimentsIntervalId = setInterval(experimentsCallback, 4);