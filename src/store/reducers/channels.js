import {VIDEO_DETAILS, WATCH_DETAILS} from '../actions/watch';
import {SUCCESS} from '../actions';
import {CHANNEL_LIST_RESPONSE} from '../api/youtube-api-response-types';

const initialState = {
    byId: {

    }
};

export default function (state = initialState, action) {
    switch(action.type) {
        case WATCH_DETAILS[SUCCESS]: 
            return reduceWatchDetails(action.response, state);
        case VIDEO_DETAILS[SUCCESS]:
            return reduceVideoDetails(action.response, state);
        default:
            return state;        
    }
};

function reduceWatchDetails(response, prevState) {
    const channelResponse = response.find(response => response.result.kind === CHANNEL_LIST_RESPONSE);
    let channels = {};
    if(channelResponse && channelResponse.result.time) {
    // we know that there will only be one item
    // because we ask for a channel with a specific id
        const channel = channelResponse.result.items[0];
        channels[channel.id] = channel;
    }
    return {
        ...prevState,
        byId: {
            ...prevState.byId,
            ...channels
        }
    }
}

function reduceVideoDetails(responses, prevState) {
    const channelResponse = responses.find(response => response.result.kind === CHANNEL_LIST_RESPONSE);
    let channelEntry = {};
    if (channelResponse && channelResponse.result.items) {
        const channel = channelResponse.result.items[0];
        channelEntry = {
            [channel.id]: channel,
        }
    }
    return {
        ...prevState.byId,
        ...channelEntry,
    }
};

/*
*   Selectors
* */

export const getChannel = (state, channelId) => {
    if(!channelId) return null;
    return state.channels.byId[channelId];
};

