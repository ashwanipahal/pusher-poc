import Pusher from 'pusher';
const pusher = new Pusher({
  appId: "1637664",
  key: "d7f7b6f80a80bc22a961",
  secret: "87b30e9a72a9e02d9f9e",
  cluster: "us2",
  useTLS: true,
});

export default pusher;