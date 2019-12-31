import postscribe from 'postscribe';
import appConfig from '../../appConfig';

export function installBaiduMaps(el, cb) {
  postscribe(el, `<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=${appConfig.mapAK}"></script>
<!--<script type="text/javascript" src="http://api.map.baidu.com/library/DistanceTool/1.2/src/DistanceTool_min.js"></script>-->
<!--<script type="text/javascript" src="//api.map.baidu.com/library/CurveLine/1.5/src/CurveLine.min.js"></script>-->
<!--<script type="text/javascript" src="//api.map.baidu.com/library/Heatmap/2.0/src/Heatmap_min.js"></script>-->
<!--<script src="TextIconOverlay.js"></script>-->
<!--<script type="text/javascript" src="http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js"></script>-->
<!--<link rel="stylesheet" href="http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.css" />-->
<!--<script type="text/javascript" src="http://api.map.baidu.com/library/SearchInfoWindow/1.4/src/SearchInfoWindow_min.js"></script>-->
<!--<link rel="stylesheet" href="http://api.map.baidu.com/library/SearchInfoWindow/1.4/src/SearchInfoWindow_min.css" />-->
<!--&lt;!&ndash;<script type="text/javascript" src="//api.map.baidu.com/library/MarkerClusterer/1.2/src/MarkerClusterer_min.js"></script>&ndash;&gt;-->
`, {
    done: () => {
      if (window.BMap) {
        if (cb) {
          cb();
        }
      }
    },
  });
}
