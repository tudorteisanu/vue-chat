<template>
  <div class="container">
    <div class="app" v-show="isChatDisplayed">
      <div class="close" @click="toggleVisibility()">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            color="currentColor"
            d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M14.59,8L12,10.59L9.41,8L8,9.41L10.59,12L8,14.59L9.41,16L12,13.41L14.59,16L16,14.59L13.41,12L16,9.41L14.59,8Z"
          />
        </svg>
      </div>
      <div ref="messages" class="messages">
        <Message
          v-for="message in messages"
          :key="message.id"
          :class="['message', { right: message.isMine }]"
          :dark="message.isMine"
          :text="message.text"
          :author="message.author"
        />
      </div>

      <ChatBox class="chat-box" @submit="onSubmit" />

      <RegisterDialog v-if="!user" @submit="onRegister" />
    </div>
    <div v-if="!isChatDisplayed" @click="toggleVisibility()" class="icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <title>chat-processing</title>
        <path
          fill="currentColor"
          d="M12,3C17.5,3 22,6.58 22,11C22,15.42 17.5,19 12,19C10.76,19 9.57,18.82 8.47,18.5C5.55,21 2,21 2,21C4.33,18.67 4.7,17.1 4.75,16.5C3.05,15.07 2,13.13 2,11C2,6.58 6.5,3 12,3M17,12V10H15V12H17M13,12V10H11V12H13M9,12V10H7V12H9Z"
        />
      </svg>
    </div>
  </div>
</template>

<script>
import Message from "@/components/Message";
import ChatBox from "@/components/ChatBox";
import { listenChat, sendMessage } from "@/core/Firebase";
import RegisterDialog from "@/components/RegisterDialog";
import { v1 as uid } from "uuid";
import Vue from "vue";

export default {
  name: "Chat",
  components: {
    RegisterDialog,
    ChatBox,
    Message,
  },
  created() {
    this.getChat();
    this.getUser();
  },
  methods: {
    onRegister(event, name) {
      event.preventDefault();
      this.user = { name, id: uid() };
      localStorage.setItem("user", JSON.stringify(this.user));
    },
    getChat() {
      listenChat((chat) => {
        this.messages = chat.reverse().map((m) => ({
          ...m,
          isMine: m.uid && m.uid === this.user?.id,
        }));

        if (this.isChatDisplayed) {
          Vue.nextTick(() => {
            const element = this.$refs["messages"];
            element.scrollTo({ behavior: "smooth", top: element.scrollHeight });
          });
        }
      });
    },
    onSubmit(event, text) {
      event.preventDefault();

      sendMessage({
        text,
        uid: this.user?.id,
        author: this.user?.name,
      });
    },
    toggleVisibility() {
      this.isChatDisplayed = !this.isChatDisplayed;

      if (this.isChatDisplayed) {
        setTimeout(() => {
          const element = this.$refs["messages"];
          element.scrollTo({ behavior: "smooth", top: element.scrollHeight });
        }, 100);
      }
    },
    getUser() {
      const rawUser = localStorage.getItem("user");

      if (rawUser) {
        this.user = JSON.parse(rawUser);
      }
    },
  },
  data: () => ({
    user: undefined,
    messages: [],
    isChatDisplayed: false,
  }),
};
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

button {
  border: 0;
  background: #2a60ff;
  color: white;
  cursor: pointer;
  padding: 1rem;
}

input {
  border: 0;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.1);
}
</style>

<style scoped>
.app {
  height: 600px;
  width: 400px;
  display: flex;
  flex-direction: column;
  border: 1px solid lightblue;
  position: fixed;
  bottom: 0;
  right: 20px;
  background: white;
  z-index: 1111;
}

.messages {
  flex-grow: 1;
  overflow: auto;
  padding: 1rem;
}

.message + .message {
  margin-top: 1rem;
}

.message.right {
  margin-left: auto;
}

.icon {
  position: fixed;
  z-index: 1111;
  bottom: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  color: gray;
  border-radius: 100%;
  background: white;
}

.close {
  position: absolute;
  top: -15px;
  left: -15px;
  width: 20px;
  height: 20px;
  cursor: pointer;
  color: gray;
}

.container {
  z-index: 1111;
}
</style>
