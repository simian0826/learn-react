require('normalize.css/normalize.css');
require('styles/App2.css');
require('styles/font-awesome.css')

import React from 'react';
import ReactDOM from 'react-dom';
let yeomanImage = require('../images/yeoman.png');

//获取图片相关数据
let imageDatas = require('json!../data/imageDatas.json');

//利用自执行函数，将图片名信息转成图片URL路径信息
imageDatas = (function genImageUrl(imageDatasArr){

	for(var i = 0 ,j = imageDatasArr.length; i < j ; i++){

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

//获取0-30的一个任意正负值
function get30DegRandom(){

	return (Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30);
}

class ImgFigure extends React.Component{
	constructor(props){
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	/*
	 *imgFigure的点击处理
	 *
	 */
	handleClick(e){

		e.stopPropagation();
		e.preventDefault();

		if (this.props.arrange.isCenter) {

			this.props.inverse();
		}else{
			this.props.center();
		}
	}

	render(){

		var styleObj = {};

		//如果props属性中指定了这长图片的位置，则使用
		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos;

		}

		//如果图片的选择角度有值，并且不为0，添加旋转角度
		if(this.props.arrange.rotate){

			(['Moz','Ms','Webkit','']).forEach(function(value){
				styleObj[value + 'Transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';

			}.bind(this));

		}

		if(this.props.arrange.isCenter){
			styleObj.zIndex = 11;
		}

		var imgFigureClassName = "img-figure";
			imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

		return(

			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
				<img width="240px" height="280px" src={this.props.data.imageUrl} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
					<div className="img-back" onClick={this.handleClick}>
						<p>
							{this.props.data.title}
						</p>
					</div>
				</figcaption>
			</figure>
		)
	}

}

class ControllerUnit extends React.Component{
	constructor(props){
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(e){

		if (this.props.arrange.isCenter) {
			this.props.inverse();

		}else{

			this.props.center();
		}

		e.stopPropagation();
		e.preventDefault();
	}

	render(){

		var controllerUnitClassName = 'controller-unit';
		var iClassName = ' ';
		if(this.props.arrange.isCenter){
			controllerUnitClassName += ' is-center';
			iClassName += 'fa fa-undo ';
		}

		if(this.props.arrange.isInverse){

			controllerUnitClassName += ' is-inverse';

			iClassName += ' ';
		}

		return <span className={controllerUnitClassName} onClick={this.handleClick}><i className={iClassName}></i></span>
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
				/*
					pos:[
						top:0,
						left:0
					]

					rotate:0,
					isInverse:false,
					isCenter:false
				 */
			]
		};

	}

	/*
	 * 翻转图片
	 * @param index 输入当前被执行的inverse操作的图片对应的图片信息数组的index值
	 * reutrn ｛function｝这是一个闭包函数，其内return一个真正被执行的函数
	 */
	inverse(index){
		return function(){

			var imgsArrangeArr = this.state.imgsArrangeArr;
			imgsArrangeArr[index].isInverse = ! imgsArrangeArr[index].isInverse;

			this.setState({
				imgsArrangeArr:imgsArrangeArr
			});

		}.bind(this)

	}

	/*
	 *利用rearrange函数居中
	 */
	center(index){
		return function(){

			this.rearrange(index);
		}.bind(this)

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
            topImgNum = Math.floor(Math.random()*2),//取或者不取
            topImgSlipceIndex = 0,

            imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

        //首先居中centerIndex的图片,居中的图片不用进行旋转
        imgsArrangeCenterArr[0] = {

        	pos:centerPos,
        	rotate:0,
        	isCenter:true
        }



        //取出要布局上侧的图片信息状态
        topImgSlipceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSlipceIndex,topImgNum);

        //布局上侧图片
        imgsArrangeTopArr.forEach(function(value,index){
        	imgsArrangeTopArr[index] = {
        		pos: {
        			top : getRangeRadom(vPosRangeTopY[0],vPosRangeTopY[1]),
        			left : getRangeRadom(vPosRangeX[0],vPosRangeX[1])
        		},
        		rotate : get30DegRandom(),
        		isCenter:false

        	};
        });



        //布局两侧的图片
        for (var i = 0 ,j = imgsArrangeArr.length , k = j / 2; i < j; i++) {

        	var hPosRangeLORX = null;

        	//前半部分左边，后半部分右边
        	if(i < k){
        		hPosRangeLORX = hPosRangeLeftSecX;
        	} else{
        		hPosRangeLORX = hPosRangeRightSecX;
        	}

        	imgsArrangeArr[i] = {
        		pos : {
        			top : getRangeRadom(hPosRangeY[0],hPosRangeY[1]),
        			left : getRangeRadom(hPosRangeLORX[0],hPosRangeLORX[1])
        		},

        		rotate : get30DegRandom()
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
					},
					rotate : 0,
					isInverse:false
				}
			}


			imgFigures.push(<ImgFigure data={value} ref={"imageFigure" + index}
				arrange={this.state.imgsArrangeArr[index]}	inverse={this.inverse(index)} center={this.center(index)}/>);

			controllerUnits.push(<ControllerUnit key={index} ref={'controllerUnit' + index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);

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
