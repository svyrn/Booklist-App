document.addEventListener('DOMContentLoaded',function(){
    const submitBuku = document.getElementById('inputBook');
    submitBuku.addEventListener('submit',function(event){
        event.preventDefault();
        addBook();
    });

    if(isStorageExist()){
        loadBookFromStorage();
    }
});

const books = [];
const RENDER_BOOK_EVENT = 'book'

document.addEventListener(RENDER_BOOK_EVENT,function(){
    const unreadedBookList = document.getElementById('incompleteBookshelfList');
    unreadedBookList.innerHTML = '';

    const readedBookList = document.getElementById('completeBookshelfList');
    readedBookList.innerHTML = '';

    for (const bookItem of books){
        const bookElement = incompleteBookListMaker(bookItem);
        if(!bookItem.isComplete){
            unreadedBookList.append(bookElement);
        }else{
            readedBookList.append(bookElement);
        }
    }
});

function addBook(){

    const bookId = generateBookId(); 

    const inputTitle = document.getElementById('inputBookTitle').value;
    const inputAuthor = document.getElementById('inputBookAuthor').value;
    const inputYearString = document.getElementById('inputBookYear').value;
    const inputYear = parseInt(inputYearString);
    const inputIsComplete = 
    document.getElementById('inputBookIsComplete').checked;

    const bookObject = generateBook(bookId, inputTitle, inputAuthor, inputYear, inputIsComplete);

    books.push(bookObject);
    document.dispatchEvent(new Event(RENDER_BOOK_EVENT));
    console.log(bookObject);

    saveBookUpdatetoStorage();
}



function generateBookId(){
    return +new Date();
}

function generateBook(id, title, author, year, isComplete){
    return{
        id, 
        title, 
        author, 
        year, 
        isComplete
    }
};

function incompleteBookListMaker(bookObject){

    const outputTitle = document.createElement('h2');
    outputTitle.innerText = bookObject.title;

    const outputAuthor = document.createElement('p');
    outputAuthor.innerText = bookObject.author;

    const outputYear = document.createElement('p');
    outputYear.innerText = bookObject.year;

    const textJoin = document.createElement('article');
    textJoin.classList.add('book_item');

    textJoin.append(outputTitle,outputAuthor,outputYear);

    textJoin.setAttribute('id', `book-${bookObject.id}`);

    if(bookObject.isComplete){
        const unreadBtn = document.createElement('button');
        unreadBtn.classList.add('green');
        unreadBtn.innerText='Belum selesai dibaca';
        unreadBtn.addEventListener('click',function(){
            unreadBookFromReaded(bookObject.id);
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('red');
        deleteBtn.innerText='Hapus buku';
        deleteBtn.addEventListener('click', function(){
            const userCONFIRM = confirm('Apakah anda ingin menghapus data ini?');
                if(userCONFIRM){
                    deleteBookFromReaded(bookObject.id);
                }else{
                    alert('Penghapusan dibatalkan');
                }
            });

        const actionContainer = document.createElement('div');
        actionContainer.classList.add('action');
        actionContainer.append(unreadBtn, deleteBtn);

        textJoin.append(actionContainer);
    }else{
        const readedBtn = document.createElement('button');
        readedBtn.classList.add('green');
        readedBtn.innerText='Selesai dibaca';
        readedBtn.addEventListener('click',function(){
            addBooktoReaded(bookObject.id);
        });

        const deleteuBtn = document.createElement('button');
        deleteuBtn.classList.add('red');
        deleteuBtn.setAttribute('id', 'CONFIRMDeleteUnread');
        deleteuBtn.innerText='Hapus buku';
        deleteuBtn.addEventListener('click', function(){
            const userCONFIRM = confirm('Apakah anda ingin menghapus data ini?');
                if(userCONFIRM){
                    deleteBookFromReaded(bookObject.id);
                }else{
                    alert('Penghapusan dibatalkan');
                }
            });

        const actionContainer = document.createElement('div');
        actionContainer.classList.add('action');
        actionContainer.append(readedBtn, deleteuBtn);

        textJoin.append(actionContainer);

    }
    return textJoin;
}

function addBooktoReaded(bookId){
    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_BOOK_EVENT));

    saveBookUpdatetoStorage();

}

function findBook(bookId){
    for(const bookItem of books){
        if(bookItem.id === bookId){
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId){
    for (const index in books){
        if(books[index].id === bookId){
            return index;
        }
    }
    return -1;
}

function deleteBookFromReaded(bookId){
    const bookTarget = findBookIndex(bookId);
    if(bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_BOOK_EVENT));
    alert('Data buku terpilih telah dihapus');
    saveBookUpdatetoStorage();

}

function unreadBookFromReaded(bookId){
    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;

    bookTarget.isComplete=false;
    document.dispatchEvent(new Event(RENDER_BOOK_EVENT));

    saveBookUpdatetoStorage();

}

// STORAGE

const BOOKBOX = 'BOOKSHELF_APPS';
const SAVED_EVENT = 'saved-book';

function isStorageExist(){
    if(typeof(Storage) === undefined){
        alert('Browser ini tidak mendukung local storage, silahkan gunakan browser lain.')
        return false;
    }
    
    return true;
}

document.addEventListener(SAVED_EVENT, function(){
    console.log(localStorage.getItem(BOOKBOX))
});

function saveBookUpdatetoStorage(){
    if(isStorageExist()){
        const parsedBook = JSON.stringify(books);
        localStorage.setItem(BOOKBOX, parsedBook);
        document.dispatchEvent(new Event(SAVED_EVENT))
    }
}

function loadBookFromStorage(){
    const getBookDataFromStorage = localStorage.getItem(BOOKBOX);
    let bookData = JSON.parse(getBookDataFromStorage);

    if(bookData !== null){
        for(const book of bookData){
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_BOOK_EVENT));
}


const searchForm = document.getElementById('searchBook');
searchForm.addEventListener('submit',(Event)=>{
    Event.preventDefault();
    const titleSearch = document.getElementById('searchBookTitle').value.toLowerCase();
    const allTitle = document.querySelectorAll('.book_item h2');

    for(const title of allTitle){
        if(title.textContent.toLowerCase().includes(titleSearch)){
            title.parentElement.style.display = '';
        }else{
            title.parentElement.style.display = 'none';
        }

        console.log(title.textContent.toLowerCase(), titleSearch);
    }
});
