import {
  DocumentReference,
  DocumentData,
  GeoPoint,
  Timestamp,
  FieldValue,
} from "firebase/firestore";

export type Chat = {
  _ref?: DocumentReference<DocumentData>;
  timestamp: Timestamp | FieldValue;
} & ChatSource;

type ChatSource = ChatReceived | ChatResponse;

type ChatResponse = {
  source: "response";
  messageId?: string;
  is_send?: boolean;
  message: ChatResponseMessage & ChatSender;
};

type ChatReceived = {
  source: "received";
  messageId: string;
  unsend?: boolean;
  message: ChatReceivedMessage;
};

export type Sender = {
  name: string;
  iconUrl?: string;
};

type ChatSender = {
  sender?: Sender;
};

type ChatResponseMessage = ChatText | ChatSendImage;

type ChatReceivedMessage =
  | ChatText
  | ChatImage
  | ChatVideo
  | ChatAudio
  | ChatLocation
  | ChatOthers;

type ChatText = {
  type: "text";
  text: string;
};

type ChatImage = ChatLINEImage | ChatExternalImage;

type ChatLINEImage = {
  provider: "line";
} & ChatImageBase;

type ChatExternalImage = {
  provider: "external";
  contentUrl: string;
  previewUrl: string;
} & ChatImageBase;

type ChatSendImage = SendImage & ChatImageBase;

export type SendImage = {
  originalContentUrl: string;
  previewImageUrl: string;
};

type ChatImageBase = {
  type: "image";
};

type ChatVideo = ChatLINEVideo | ChatExternalVideo;

type ChatLINEVideo = {
  provider: "line";
} & ChatVideoBase;

type ChatExternalVideo = {
  provider: "external";
  contentUrl: string;
  previewUrl: string;
} & ChatVideoBase;

type ChatVideoBase = {
  type: "video";
};

type ChatLocation = {
  type: "location";
  title: string;
  address: string;
  location: GeoPoint;
};

type ChatAudio = ChatLINEAudio | ChatExternalAudio;

type ChatLINEAudio = {
  provider: "line";
} & ChatAudioBase;

type ChatExternalAudio = {
  provider: "external";
  contentUrl: string;
} & ChatAudioBase;

type ChatAudioBase = {
  type: "audio";
};

type ChatOthers = {
  type: "others";
  kind: string;
};
