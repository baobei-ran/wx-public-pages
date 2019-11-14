!function () {
    if (window.location.protocol === 'https:') {
      var nodeMeta = document.createElement('meta');
      nodeMeta.httpEquiv = "Content-Security-Policy";
      nodeMeta.content = "upgrade-insecure-requests";
      var html = document.getElementsByTagName('head')[0];
      var meta2 = html.getElementsByTagName('meta')[1];
      html.insertBefore(nodeMeta, meta2)
    } else {
      var html2 = document.getElementsByTagName('head')[0];
      var meta3 = html2.getElementsByTagName('meta')[1];
      if (meta3.content === 'upgrade-insecure-requests') {
        meta3.parentNode.removeChild(meta3)
      }
    }
}();