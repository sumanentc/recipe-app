import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        try {
            const proxy = "https://cors-anywhere.herokuapp.com/";
            const apiUrl = "https://forkify-api.herokuapp.com/api/search?";
            const res = await axios(`${proxy}${apiUrl}q=${this.query}`);
            this.result = res.data.recipes;
            //console.log(this.result);
        } catch (error) {
            console.log("Exception occurred during Search for reciepe " + error);
            alert(error);
        }
    };

}