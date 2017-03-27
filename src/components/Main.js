require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

let yeomanImage = require('../images/yeoman.png');

//获取图片相关数据
var imageDatas = require('../data/imageDatas.json');


//利用自执行函数，将图片名信息转成图片URL路径信息
imageDatas = (function genImageUrl(imageDatasArr){

	for(var i = 0 ; i < imageDatasArr.length ; i++){

		var singleImageData = imageDatasArr[i];

		singleImageData.imageUrl = require("../images/" + singleImageData.fileName);

		imageDatasArr[i] = singleImageData;



	}

	return imageDatasArr;

})(imageDatas);




class AppComponent extends React.Component {
  render() {
    return (
      	<section className="stage">
      		<section className="img-sec">

      		</section>
			
			<nav className="controller-nav" >
				
			</nav>
      	</section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
