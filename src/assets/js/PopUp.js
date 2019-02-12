/**
 * Created by liyc on 2018/6/14.
 */
const PopUp = (function () {
  function PopUp(viewer) {
    this.popUpCreated = false;
    this.viewer = viewer;
    this.removeHandler = undefined;
    this.entity = undefined;
  }
  PopUp.prototype.showPopUp = function (position) {
    var self = this;
    self.closePopUp();

    self.entity = viewer.entities.add({
      position: position,
      billboard: {
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
      }
    });
    if (!self.popUpCreated) {
      $('#trackPopUpLink').empty();
      self.popUpCreated = true;
    }
    $('#trackPopUp').show();
    if (self.popUpCreated) {
      var c = Cesium.SceneTransforms.wgs84ToWindowCoordinates(self.viewer.scene, self.entity.position.getValue(Cesium.JulianDate.now()));
      self.positionPopUp(c);
      self.removeHandler = viewer.scene.postRender.addEventListener(function () {
        var changedC = Cesium.SceneTransforms.wgs84ToWindowCoordinates(self.viewer.scene, self.entity.position.getValue(Cesium.JulianDate.now()));
        if ((c.x !== changedC.x) || (c.y !== changedC.y)) {
          self.positionPopUp(changedC);
          c = changedC;
        }
      });
      $('.popup-close-button').click(function () {
        self.closePopUp();
        return false;
      });
    }
  }
  PopUp.prototype.closePopUp = function () {
    $('#trackPopUp').hide();
    $('#trackPopUpLink').empty();
    if (this.removeHandler != undefined) {
      this.removeHandler.call();
      this.removeHandler = undefined;
    }
    if (this.entity != undefined) {
      this.viewer.entities.remove(this.entity);
      this.entity = undefined;
    }
    this.popUpCreated = false;

  }
  PopUp.prototype.positionPopUp = function (c) {
    var x = c.x - ($('#trackPopUpContent').width()) / 2;
    var y = c.y - ($('#trackPopUpContent').height()) - 30; //移动弹窗上下，以避免遮盖图标
    $('#trackPopUpContent').css('transform', 'translate3d(' + x + 'px, ' + y + 'px, 0)');
  }
  PopUp.prototype.showHtml = function (html) {
    $('#trackPopUpLink').empty();
    $('#trackPopUpLink').append(html);

    // document.getElementById("video").style.display = "none"//不显示

  }
  return PopUp;
})()

module.exports = PopUp
