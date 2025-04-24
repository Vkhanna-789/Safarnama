// import ADD_STORY_IMG from "assets/images/add-story.svg";
// import NO_SEARCH_DATA_IMG from "assets/images/no-search-data.svg";
// import NO_FILTER_DATA_IMG from "assets/images/no-filter-data.svg";

import { defaultStyles } from "react-modal";

export const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
    }
    export const getInitials = (name) => {
        if (!name) return "";

    const words= name.split("");
    let initials =""
    for(let i=0; i<Math.min(words.length,2); i++){
        initials += words[i][0];
    }
    return initials.toUpperCase();
}
export const getEmptyCardMessage = (filterType) => {
    switch (filterType) {
        case "search":
            return "Oops! No stories";

        case "date":
            return "No stories for this date";

        default:
            return "No stories available";
    }
};
// export const getEmptyCardImg = (filterType) => {
//     const imageMap = {
//         search: NO_SEARCH_DATA_IMG,
//         date: NO_FILTER_DATA_IMG,
//     };
//     return imageMap[filterType] || ADD_STORY_IMG;
// };


