export default class Likes{
    constructor(){
        this.likes = [];
    }

    addLike(id, title, author, img) {
        const like = { id, title, author, img };
        this.likes.push(like);

        // Perist data in localStorage
        this.persistData();

        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);

        // Perist data in localStorage
        this.persistData();
    }

    isLiked(id) {
        if(this.likes){
             return this.likes.findIndex(el => el.id === id) !== -1;
        }
        return false;
    }

    getNumLikes() {
        if(this.likes){
            return this.likes.length;
        }
        return 0;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        
        // Restoring likes from the localStorage
        if (storage) this.likes = storage;
    }

};