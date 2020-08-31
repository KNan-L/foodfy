// ========= Menu  ======== //
const currentPage = location.pathname
const menuItems = document.querySelectorAll("header .menu a")

for (item of menuItems) {
    if (currentPage.includes(item.getAttribute("href"))){
        item.classList.add("active")
    }
    
}

// ========= Apresentação de Receitas  ======== //
// ======== Click Mais Acessadas ======= //
const acessados = document.querySelectorAll('.acessados')
for ( let acessado of acessados ) {
    const recipesID = acessado.querySelector("#input").value
    acessado.addEventListener('click', function() {        
        window.location.href = `/recipes/${recipesID}`        
    })
}

// ======== Click de Receitas ======= //
const receitas = document.querySelectorAll('.receita')
for ( let receita of receitas ) {
    const recipesID = receita.querySelector("#input").value
    receita.addEventListener('click', function() {        
        window.location.href = `/recipes/${recipesID}`        
    })
}

// ========= Pagination ======== //

function paginate(selectedPage, totalPages) {
    let pages = [],
        oldPage

    for (let currentPage = 1; currentPage <= totalPages; currentPage ++ ){
        const firstAndLastPage = currentPage == 1 || currentPage == totalPages
        const pagesAfterSelectedPage = currentPage <= selectedPage + 2
        const pagesBeforeSelectedPage = currentPage>= selectedPage - 2

        if (firstAndLastPage || pagesBeforeSelectedPage && pagesAfterSelectedPage){
            if(oldPage && currentPage - oldPage > 2 ) {
                pages.push("...")
            }

            if(oldPage && currentPage - oldPage == 2){
                pages.push(oldPage + 1)
            }

            pages.push(currentPage)
            oldPage = currentPage
        }
    }
    return pages
}

function createPagination(pagination) {
    const page = +pagination.dataset.page
    const total = +pagination.dataset.total
    const pages = paginate(page, total)


    let elements = ""

    for ( let page of pages ) {
        if(String(page).includes("...")) {
            elements += `<span>${page}</span>`
        } else {
            elements += `<a href="?page=${page}">${page}</a>`
        }
    }

    pagination.innerHTML = elements
}

const pagination = document.querySelector(".pagination")

if (pagination) {
    createPagination(pagination)
}

/*******PHOTOS*******/

// =========== PHOTOS ===========//

const PhotosUpload = {
    input: "",
    preview: document.querySelector("#photos-preview"),
    uploadLimit: 5,
    files: [],
    handleFileInput(event) {
        const { files: fileList } = event.target
        PhotosUpload.input = event.target

        if(PhotosUpload.hasLimit(event)) return

        Array.from(fileList).forEach(file => {
            PhotosUpload.files.push(file)

            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image
                image.src = String(reader.result)

                const div = PhotosUpload.getContainer(image)

                PhotosUpload.preview.appendChild(div)
            }
            reader.readAsDataURL(file)
            
        })
        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },
    

    hasLimit(event) {
        const { uploadLimit, input, preview } = PhotosUpload
        const { files: fileList } = input

        if ( fileList.length > uploadLimit ) {
            alert(`Envie no máximo ${uploadLimit} fotos.`)
            event.preventDefault()

            return true
        }

        const photosDiv = []
        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value == "photo"){
                photosDiv.push(item)
            }
        })

        const totalPhotos = fileList.length + photosDiv.length
        if (totalPhotos > uploadLimit) {
            alert("Você atingiu o limite máximo de fotos")
            event.preventDefault()
            return true
        }

        return false
    },

    getAllFiles() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer

        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },

    getContainer(image) {
        const div = document.createElement("div")
        div.classList.add('photo')
        
        div.onclick = PhotosUpload.removePhoto
        
        div.appendChild(image)

        div.appendChild(PhotosUpload.getRemoveButton())

        return div
    },

    getRemoveButton() {
        const button = document.createElement("i")
        button.classList.add("material-icons")
        button.innerHTML = "close"

        return button
    },

    removePhoto(event) {
        const photoDiv = event.target.parentNode
        const photosArray = Array.from(PhotosUpload.preview.children)
        const index = photosArray.indexOf(photoDiv)

        PhotosUpload.files.splice(index, 1)
        PhotosUpload.input.files = PhotosUpload.getAllFiles()

        photoDiv.remove()
    },

    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode
        
        if (photoDiv) {
            const removedFiles = document.querySelector('input[name="removed_files"')

            if (removedFiles) {
                removedFiles.value += `${photoDiv.id},`
            }
        }

        photoDiv.remove()
    }

}

// ====== PHOTOS SHOW GALLERY  ====== //
const ImageGallery = {
    highlight: document.querySelector('.gallery .highlight > img'),

    previews: document.querySelectorAll('.gallery-preview img'),

    setImage(e) {
        const { target } = e

        ImageGallery.previews.forEach(preview => preview.classList.remove('active'))
        target.classList.add('active')

        ImageGallery.highlight.src = target.src
        Lightbox.image.src = target.src
    }
}

const Lightbox = {
    target: document.querySelector('.lightbox-target'),
    image: document.querySelector('.lightbox-target img'),
    closeButton: document.querySelector('lightbox-target a.lightbox-close'),

    open() {
        Lightbox.target.style.opacity = 1
        Lightbox.target.style.top = 0
        Lightbox.target.style.button = 0
        Lightbox.closeButton.style.top = 0
    },

    close() {
        Lightbox.target.style.opacity = 0
        Lightbox.target.style.top = "-100%"
        Lightbox.target.style.button = "initial"
        Lightbox.closeButton.style.top = "-80px"
    }
}
