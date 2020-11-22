function downloadImage(url) {
    var tag = document.createElement('a')
    tag.href = url
    tag.target = '_blank'
    tag.download = 'product.jpg'
    document.body.appendChild(tag)
    tag.click()
    document.body.removeChild(tag)
}
$(()=>{
    var element = $('#photo')[0]
    var url
    element.addEventListener('change', function() { 
        url = URL.createObjectURL(element.files[0]); 
        console.log(url)
    })
    
    $('#submit').click(()=>{
        console.log(url)
        if(url!=''){
            downloadImage(url)
        }
    })
})
