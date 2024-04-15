// Trying to override yt experiment flags before yt reads it

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

experimentsIntervalId = setInterval(experimentsCallback, 4);