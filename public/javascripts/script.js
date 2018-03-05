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

