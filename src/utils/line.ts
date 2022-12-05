import axios from "axios";

export const getLINEContent = async (
  messageId: string
): Promise<Blob | null> => {
  let data;
  await axios({
    method: "GET",
    baseURL: "https://api-data.line.me",
    url: `/v2/bot/message/${messageId}/content`,
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_LINE_CHANNEL_ACCESS_TOKEN}`,
    },
    responseType: "arraybuffer",
  })
    .then((response) => {
      data = response.data;
    })
    .catch((err) => {
      console.error(err);
      console.log("Cannot get content.");
    });
  if (data) return new Blob([data]);
  return null;
};
