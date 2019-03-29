import distanceWordsToNow from "date-fns/distance_in_words_to_now";
import format from "date-fns/format";

export const formatTimeCreated = time =>
  distanceWordsToNow(time, {
    includeSeconds: true,
    addSuffix: true
  });

export const formatDate = date => format(date, "dddd, MMMM Do,YYYY");
