(function ($) {

  $('#delAccount').on('click',function () {

    swal({
      title: 'Etes-vous sur ?',
      text: 'Vous allez supprimer votre compte!',
      type: 'warning',
      confirmButtonColor : "#f53d3d",
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    })
      .then((result) => {
        if (result.value) {
          swal(
            'Supprimer!',
            '',
            'success'
          )
          // For more information about handling dismissals please visit
          // https://sweetalert2.github.io/#handling-dismissals
        } else if (result.dismiss === swal.DismissReason.cancel) {
          swal(
            'Annuler',
            '',
            'error'
          )
        }
      })
  });

})(jQuery);

(function ($) {
    $(document).ready(function() {

        $('#inputSearch').on('input', function(){

            const value =  $('#inputSearch').val();





            if (value.length >= 3) {
                $.ajax({
                    dataType: 'json',
                    url: '/search?term='+value,
                    method: "GET",
                    timeout: 1500
                }).done(function( response ) {
                    let html = '';

                    response.map((restaurant) => {
                      html += `<tr> 
                            <td> ${restaurant.name} </td> 
                            <td> ${restaurant.borough} </td> 
                            <td> ${restaurant.cuisine} </td> 
                            <td><button class="btn btn-xs btn-primary addComment" data-id="${restaurant._id}">Ajout commentaire</button></td>
                        </tr>`
                    });
                    $('#body').html(html);
                });
            }
            
        })
    });
})(jQuery);

(function ($) {
    $(document).ready(function() {

        $('body ').on('click', '.addComment', function(){
            console.log($(this).data('id'));

            $('#ref').val($(this).data('id'))

            $('#formNotation').toggle();
        })
    });
})(jQuery);
