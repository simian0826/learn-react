require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';
let yeomanImage = require('../images/yeoman.png');

//获取图片相关数据
let imageDatas = require('json!../data/imageDatas.json');

//利用自执行函数，将图片名信息转成图片URL路径信息
imageDatas = (function genImageUrl(imageDatasArr){

	for(var i = 0 ; i < imageDatasArr.length ; i++){

		var singleImageData = imageDatasArr[i];

		singleImageData.imageUrl = require("../images/" + singleImageData.fileName);

		imageDatasArr[i] = singleImageData;



	}

	return imageDatasArr;

})(imageDatas);

//获取一个区间里的随机值
function getRangeRadom(low,height){

	return Math.ceil(Math.random() * (height - low) + low);
}

class ImgFigure extends React.Component{
	render(){

		var styleObj = {};

		//如果props属性中指定了这长图片的位置，则使用
		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos;

		}

		return(

			<figure className="img-figure" style={styleObj}>
				<img width="240px" height="280px" src={this.props.data.imageUrl} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
				</figcaption>
			</figure>
		)
	}

}


class AppComponent extends React.Component {
	constructor(props){
		super(props);
		this.Constant = {
			centerPos:{
			left:0,
			top:0

			},

			hPosRange:{ //水平方向的取值范围
			leftSecX:[0,0],
			rightSecX:[0,0],
			y:[0,0]

			},

			vPosRange:{ //垂直方向的取值范围
			x:[0,0],
			topY:[0,0]

			}
		};

		this.state = {

			imgsArrangeArr : [

			]
		};

	}

	

	/*
	 * 重新布局所有图片的位置
	 * @param centerIndex
	 */
	 rearrange(centerIndex){
	 	var imgsArrangeArr = this.state.imgsArrangeArr,
            Constant = this.Constant,
            centerPos = Constant.centerPos,
            hPosRange = Constant.hPosRange,
            vPosRange = Constant.vPosRange,
            hPosRangeLeftSecX = hPosRange.leftSecX,
            hPosRangeRightSecX = hPosRange.rightSecX,
            hPosRangeY = hPosRange.y,
            vPosRangeTopY = vPosRange.topY,
            vPosRangeX = vPosRange.x,

            imgsArrangeTopArr = [],
            topImgNum = Math.ceil(Math.random()*2),//取或者不取
            topImgSlipceIndex = 0,

            imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

        //首先居中centerIndex的图片
        imgsArrangeCenterArr[0] = {

        	pos:centerPos,
        }

        //取出要布局上侧的图片信息状态
        topImgSlipceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSlipceIndex,topImgNum);

        //布局上侧图片
        imgsArrangeTopArr.forEach(function(value,index){
        	imgsArrangeTopArr[index].pos = {

        		top : getRangeRadom(vPosRangeTopY[0],vPosRangeTopY[1]),
        		left : getRangeRadom(vPosRangeX[0],vPosRangeX[1])
        	};
        });

        console.log(hPosRangeRightSecX);

        //布局两侧的图片
        for (var i = 0 ,j = imgsArrangeArr.length , k = j / 2; i < j; i++) {

        	var hPosRangeLORX = null;

        	//前半部分左边，后半部分右边
        	if(i < k){
        		hPosRangeLORX = hPosRangeLeftSecX;
        	} else{
        		hPosRangeLORX = hPosRangeRightSecX;
        	}
        	
        	imgsArrangeArr[i].pos = {

				top : getRangeRadom(hPosRangeY[0],hPosRangeY[1]),
        		left : getRangeRadom(hPosRangeLORX[0],hPosRangeLORX[1])

        	};

        }
 
        if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
        	imgsArrangeArr.splice(topImgSlipceIndex, 0, imgsArrangeTopArr[0]);
        }

        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

        this.setState({
        	imgsArrangeArr : imgsArrangeArr
        });

	 }



	//组件加载以后为每张图片计算返回
	componentDidMount(){
		

		//获取舞台的大小
		var stageDOM = ReactDOM.findDOMNode(this.refs.stage);
		var stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfStageW = Math.ceil(stageW / 2),
			halfStageH = Math.ceil(stageH / 2 )

		//获取imageFigure的大小
		var imageFigureDOM = ReactDOM.findDOMNode(this.refs.imageFigure0);
		var imgW = imageFigureDOM.scrollWidth,
			imgH = imageFigureDOM.scrollHeight,
			halfImgW = Math.ceil(imgW / 2),
			halfImgH = Math.ceil(imgH / 2);


		//计算中心图片的位置点
		this.Constant.centerPos = {
			left : halfStageW - halfImgH,
			top :　halfStageH - halfImgH
		}

		//计算左侧，右侧区域图片排布的取值范围 
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW*3;
		
		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;

		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH - halfImgW;

		//计算上侧区域图片排布取值范围
		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfStageW;

		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH*3;

		this.rearrange(0);
	}

    render() {
	
		var controllerUnits = [],
		imgFigures = [];

		imageDatas.forEach(function(value,index){

			if(!this.state.imgsArrangeArr[index]){

				this.state.imgsArrangeArr[index] = {
					pos:{
						left:0,
						top:0
					} 
				}
			}


			imgFigures.push(<ImgFigure data={value} ref={"imageFigure" + index}
				arrange={this.state.imgsArrangeArr[index]}	/>);
		}.bind(this));

	    return (
	      	<section className="stage" ref="stage">
	      		<section className="img-sec">
					{imgFigures}
	      		</section>
				
				<nav className="controller-nav" >
					{controllerUnits}
				</nav>
	      	</section>
	    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
