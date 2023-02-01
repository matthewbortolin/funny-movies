<template>
  <div>
  <!-- Navbar -->
  <b-navbar type="dark" variant="primary">
    <b-navbar-brand href="#" class="d-inline-flex">
      <b-icon icon="house-fill" 
        scale="2" 
        class="mt-3">
      </b-icon>
      <h1 class="m-2">Funny Movies</h1>
    </b-navbar-brand>
    <b-navbar-nav v-if="user.username === ''">
      <!-- User sign in form -->
      <b-nav-form>
        <b-form-input v-model="username" 
          placeholder="Email" 
          type="email"
          required
          class="m-2">
        </b-form-input>
        <b-form-input v-model="password" 
          placeholder="Password" 
          type="password"
          required
          class="m-2">
        </b-form-input>
      </b-nav-form>
      <b-button @click="loginCreateUser"
        variant="outline-light"
        class="m-2">Login</b-button>
    </b-navbar-nav>
    <!-- If user is logged in display username and share, 
      logout buttons -->
    <b-navbar-nav v-if="user.username !== ''">
      <b-nav-text variant="light"
        class="m-2">Welcome {{ user.username }}</b-nav-text>
      <b-button  @click="toggleShare"
        variant="outline-light"
        class="m-2">Share a Movie</b-button>
      <b-button @click="logOut"
        variant="outline-light"
        class="m-2">Logout</b-button>
    </b-navbar-nav>
  </b-navbar>
  <body>
    <!-- Display main page on share=false -->
    <div v-if="share === false">
      <!-- If data is loading display loading icon-->
      <div v-if=$fetchState.pending
        class="mt-2 text-center">
        <b-spinner variant="primary"
          class="h1">
        </b-spinner>
      </div>
      <!-- Iterate movies[] display youTube player, 
        title, descripton, votes-->
      <b-container fluid="md" 
        v-for="movie in movies" 
        :key="movie.id" 
        class="mt-2">
        <b-row>
          <b-col>
            <div class="youtube">
              <lite-youtube
                :videoid=movie.link
              />
            </div>
          </b-col>
          <b-col>
            <h4>{{ movie.title }}</h4>
            <p class="d-inline-flex">Shared by {{ movie.sharedBy }} 
            </p>
            <!-- If signed in user display vote icons, already voted displayed filled-->
            <div v-if="user.username !== ''"
              class="d-inline-flex">
              <div v-if="user.userVote[movie.id] === 'up'"
                class="d-inline-flex m-3">
                  <b-icon icon="hand-thumbs-up-fill" scale="3"></b-icon>
                </div>
                <div v-else-if="user.userVote[movie.id] === 'down'"
                  class="d-inline-flex m-3">
                  <b-icon icon="hand-thumbs-down-fill" scale="3"></b-icon>
                </div>
                <div v-else class="d-inline-flex">
                  <b-icon icon="hand-thumbs-up" 
                    @click="upVote(movie.id)"
                    style="cursor:pointer"
                    scale="3" class="m-3"></b-icon>
                  <b-icon icon="hand-thumbs-down" 
                    @click="downVote(movie.id)"
                    style="cursor:pointer"
                    scale="3" class="m-3"></b-icon>
                </div>
              </div>
            <div>
              <!-- Display total votes, description-->
              <b-icon icon="hand-thumbs-up">
              </b-icon>{{ movie.upVotes }}
              <b-icon icon="hand-thumbs-down">
              </b-icon>{{ movie.downVotes }}
            </div>
            <p class="mt-1">Description: {{ movie.description }}</p>
          </b-col>
        </b-row>
      </b-container>
    </div>
    <!-- If shareMovie clicked display form-->
    <div v-if="share === true"
      class="text-center">
      <h2 class="mt-2">Share Movie</h2>
      <b-row>
        <b-col></b-col>
        <b-col>
          <b-form>
            <b-form-group
              label="YouTube Title:"
              class="text-left">
              <b-form-input
                v-model="title"
                placeholder="Enter Title"
                required />
            </b-form-group>
            <b-form-group
              label="YouTube Link:"
              class="text-left">
              <b-form-input
                v-model="link"
                placeholder="Enter YouTube link eg. aW99Hks20"
                required />
            </b-form-group>
            <b-form-group
              label="YouTube Description:"
              class="text-left">
              <b-form-textarea
                v-model="description"
                placeholder="Enter short description"
                rows="3"
                max-length="200"
                required />
            </b-form-group>
            <b-button @click="shareMovie()"
              size="lg"
              variant="primary">Share
            </b-button>
          </b-form>
        </b-col>
        <b-col></b-col>
      </b-row>
    </div>
  </body>
</div>
</template>

<script>
import Axios from 'axios';

export default {
  name: 'IndexPage',
  data () {
    return {
      movies: [],
      user: {
        username: "",
        userVote: {
        }
      },
      username: "",
      password: "",
      moviesRef: this.$fire.database.ref('movies').toString(),
      share: false,
      link: "",
      title: "",
      description: ""
    }
  },
  //Retrieves all movies on load
  async fetch() {
    this.movies = [];
    try {
      await Axios.get(this.moviesRef + '.json').then(response => {
        this.formatMovies(response.data)
        });
        } catch (e) {
          this.errorMsg = e.message;
        }
  },
  methods: {
    //Log out user
    async logOut() {
      try {
        await this.$fire.auth.signOut().then(() => {
          this.user = {username: "", userVote: {}};
        });
        if (this.share === true) {
          this.toggleShare();
        }
      } catch (e) {
        alert(e.message);
      }
    },
    //Retrieve user info and store in user
    async loginUser(username) {
      const usersRef = this.$fire.database.ref('users').toString();
      //Get auth token and add as auth parameter
      const token = await this.$fire.auth.currentUser.getIdToken();
      try {
        await Axios.get(usersRef + '.json?auth=' + token).then(response => {
          this.formatUser(response.data, username);
        });
      } catch (e) {
        alert(e.message);
      }
    },
    //Get user id and assign
    formatUser (users, username) {
      for (let key in users) {
        if (users[key].username === username) {
          this.user = { ...users[key], id:key};
        }
      }
    },
    //Add movie id to movies
    formatMovies (movies) {
      for (let key in movies) {
        this.movies.push({ ...movies[key], id:key });
      }
    },
    //Log in user with username and password 
    //If user is not found a new one is created
    //And Logged in
    async loginCreateUser() {
      try {
        //Login user and assign to user
        await this.$fire.auth.signInWithEmailAndPassword(this.username,
          this.password).then((userCredential) => {
              this.loginUser(userCredential.user.email);
          });
          //this.loginUser(userCred.email);
      } catch (e) {
        //If user doesn't exist create new user
        if (e.code === 'auth/user-not-found') {
          try {
            await this.$fire.auth.createUserWithEmailAndPassword(
              this.username, this.password).then(() => {
                //Add user to database
                this.addUser(this.username);
                });
            //Login user and assign to user
            await this.$fire.auth.signInWithEmailAndPassword(this.username,
              this.password).then((userCredential) => {
                this.loginUser(userCredential.user.email);
              });
          } catch (e) {
            alert(e.message);
          }
        } else {
          alert(e.message);
        }
      }
    },
    //Add user to database
    async addUser(username) {
      const usersRef = this.$fire.database.ref('users').toString();
      try{
        //Get auth token and add as auth parameter
        const token = await this.$fire.auth.currentUser.getIdToken();
        await Axios.post(usersRef +'.json?auth=' + token, 
          { username: username, 
            userVote: {id: ""}
          }
        );
        
      } catch (e) {
        alert(e.message);
      }
    },
    //Save movie details, fetch movies and assign values to ''
    async shareMovie() {
      if (this.title === '' || this.link === '' || this.description === '') {
        alert("Fields must not be empty");
      } else {
        try {
          //Get auth token and add as auth parameter
          const token = await this.$fire.auth.currentUser.getIdToken();
          await Axios.post(this.moviesRef+'.json?auth=' + token, { "title": this.title,
            "link": this.link,
            "description": this.description,
            sharedBy: this.user.username,
            upVotes:0,
            downVotes: 0});
          this.$fetch();
          this.toggleShare();
          this.title = "";
          this.link = "";
          this.description = "";
        } catch (e) {
          alert(e.message);
        }
      }
    },
    //Increments movie upvote and assigns user vote 
    //To user.upVote
    async upVote(movieId) {
      const upVotesRef = this.$fire.database.ref('movies').child(movieId).child('upVotes').toString() 
        + '.json';
      const userVoteRef = this.$fire.database.ref('users').child(this.user.id).child('userVote').toString() + '.json';
      try {
        //Get auth token and add as auth parameter
        const token = await this.$fire.auth.currentUser.getIdToken();
        var vote = await Axios.get(upVotesRef).then(response  => {
          return response.data
        });
        await Axios.put(upVotesRef + '?auth=' + token, ++vote);
        await Axios.patch(userVoteRef + '?auth=' + token, {[movieId]: "up"});
        this.user.userVote[movieId] = "up";
        this.$fetch();
      } catch (e) {
        alert(e.message);
      }
    },
    //Increments user downVote and assigns user vote
    //To user.downVote
    async downVote(movieId) {
      const downVotesRef = this.$fire.database.ref('movies').child(movieId).child('downVotes').toString() 
        + '.json';
      const userVoteRef = this.$fire.database.ref('users').child(this.user.id).child('userVote').toString() + '.json';
      try {
        //Get auth token and add as auth parameter
        const token = await this.$fire.auth.currentUser.getIdToken();
        var vote = await Axios.get(downVotesRef).then(response  => {
          return response.data
        });
        await Axios.put(downVotesRef + '?auth=' + token, ++vote);
        await Axios.patch(userVoteRef + '?auth=' + token, {[movieId]: "down"});
        this.user.userVote[movieId] = "down";
        this.$fetch();
      } catch (e) {
        alert(e.message);
      }
    },
    toggleShare () {
      this.share = !this.share;
    }
  }
}
</script>
