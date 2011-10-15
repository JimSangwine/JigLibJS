(function(c){var g=c.Vector3DUtil;var b=c.JMatrix3D;var d=c.JNumber3D;var h=c.RigidBody;var f=c.EdgeData;var e=c.SpanData;var a=function(k,j,l,i){c.RigidBody.call(this);this._edges=[new f(0,1),new f(3,1),new f(2,3),new f(2,0),new f(4,5),new f(5,7),new f(6,7),new f(4,6),new f(7,1),new f(5,3),new f(4,2),new f(6,0)];this._faces=[[6,7,1,0],[5,4,2,3],[3,1,7,5],[4,6,0,2],[1,3,2,0],[7,6,4,5]];this._type="BOX";this._sideLengths=g.create(j,i,l,0);this._boundingSphere=0.5*g.get_length(this._sideLengths);this.initPoints();this.set_mass(1);this.updateBoundingBox();};c.extend(a,c.RigidBody);a.prototype._sideLengths=null;a.prototype._points=null;a.prototype._edges=null;a.prototype._faces=null;a.prototype.initPoints=function(){var i=this.getHalfSideLengths();this._points=[];this._points[0]=g.create(i[0],-i[1],i[2],0);this._points[1]=g.create(i[0],i[1],i[2],0);this._points[2]=g.create(-i[0],-i[1],i[2],0);this._points[3]=g.create(-i[0],i[1],i[2],0);this._points[4]=g.create(-i[0],-i[1],-i[2],0);this._points[5]=g.create(-i[0],i[1],-i[2],0);this._points[6]=g.create(i[0],-i[1],-i[2],0);this._points[7]=g.create(i[0],i[1],-i[2],0);};a.prototype.set_sideLengths=function(i){this._sideLengths=i.slice(0);this._boundingSphere=0.5*g.get_length(this._sideLengths);this.initPoints();this.setInertia(this.getInertiaProperties(this.get_mass()));this.setActive();this.updateBoundingBox();};a.prototype.get_sideLengths=function(){return this._sideLengths;};a.prototype.get_edges=function(){return this._edges;};a.prototype.getVolume=function(){return(this._sideLengths[0]*this._sideLengths[1]*this._sideLengths[2]);};a.prototype.getSurfaceArea=function(){return 2*(this._sideLengths[0]*this._sideLengths[1]+this._sideLengths[0]*this._sideLengths[2]+this._sideLengths[1]*this._sideLengths[2]);};a.prototype.getHalfSideLengths=function(){return d.getScaleVector(this._sideLengths,0.5);};a.prototype.getSpan=function(k){var o=this.get_currentState().getOrientationCols();var n=new e();var j=Math.abs(g.dotProduct(k,o[0]))*(0.5*this._sideLengths[0]);var i=Math.abs(g.dotProduct(k,o[1]))*(0.5*this._sideLengths[1]);var q=Math.abs(g.dotProduct(k,o[2]))*(0.5*this._sideLengths[2]);var l=j+i+q;var m=g.dotProduct(this.get_currentState().position,k);n.min=m-l;n.max=m+l;return n;};a.prototype.getCornerPoints=function(p){var o;var j=[];var k=b.getTranslationMatrix(p.position[0],p.position[1],p.position[2]);k=b.getAppendMatrix3D(p.get_orientation(),k);for(var l=0,m=this._points.length;l<m;l++){var n=this._points[l];o=g.create(n[0],n[1],n[2],0);b.multiplyVector(k,o);j.push(o);}return j;};a.prototype.getCornerPointsInBoxSpace=function(l,p){var k=b.getTransposeMatrix(p.get_orientation());var q=g.subtract(l.position,p.position);b.multiplyVector(k,q);var n=b.getAppendMatrix3D(l.get_orientation(),k);var j=[];var m=b.getTranslationMatrix(q[0],q[1],q[2]);m=b.getAppendMatrix3D(n,m);for(var o=0;o<this._points.length;o++){_point=this._points[o].slice(0);b.multiplyVector(m,_point);j[o]=_point;}return j;};a.prototype.getSqDistanceToPoint=function(m,k,j){k.pos=g.subtract(j,m.position);b.multiplyVector(b.getTransposeMatrix(m.get_orientation()),k.pos);var n=0;var l=0;var i=this.getHalfSideLengths();if(k.pos[0]<-i[0]){n=k.pos[0]+i[0];l+=(n*n);k.pos[0]=-i[0];}else{if(k.pos[0]>i[0]){n=k.pos[0]-i[0];l+=(n*n);k.pos[0]=i[0];}}if(k.pos[1]<-i[1]){n=k.pos[1]+i[1];l+=(n*n);k.pos[1]=-i[1];}else{if(k.pos[1]>i[1]){n=k.pos[1]-i[1];l+=(n*n);k.pos[1]=i[1];}}if(k.pos[2]<-i[2]){n=k.pos[2]+i[2];l+=(n*n);k.pos[2]=-i[2];}else{if(k.pos[2]>i[2]){n=(k.pos[2]-i[2]);l+=(n*n);k.pos[2]=i[2];}}b.multiplyVector(m.get_orientation(),k.pos);k.pos=g.add(m.position,k.pos);return l;};a.prototype.getDistanceToPoint=function(k,j,i){return Math.sqrt(this.getSqDistanceToPoint(k,j,i));};a.prototype.pointIntersect=function(n){var m=g.subtract(n,this.get_currentState().position);var k=d.getScaleVector(this._sideLengths,0.5);var j;var l=this.get_currentState().getOrientationCols();for(var i;i<3;i++){j=l[i].slice(0);g.normalize(j);if(Math.abs(g.dotProduct(j,m))>k[i]+d.NUM_TINY){return false;}}return true;};a.prototype.getSupportVertices=function(p){var v=[];var w=[1,1,1];var x;var y=this.get_currentState().getOrientationCols();g.normalize(y[0]);g.normalize(y[1]);g.normalize(y[2]);for(var s=0;s<3;s++){w[s]=g.dotProduct(p,y[s]);if(Math.abs(w[s])>1-0.001){var u=(w[s]<0)?(s*2):(s*2)+1;for(var r=0;r<4;r++){x=this._points[this._faces[u][r]];var z=v[r]=this.get_currentState().position.slice(0);z=g.add(z,d.getScaleVector(y[0],x[0]));z=g.add(z,d.getScaleVector(y[1],x[1]));z=g.add(z,d.getScaleVector(y[2],x[2]));}return v;}}for(s=0;s<3;s++){if(Math.abs(w[s])<0.005){var q;var o=(s+1)%3;var l=(s+2)%3;x=this.get_currentState().position.slice(0);q=(w[o]>0)?-1:1;x=g.add(x,d.getScaleVector(y[o],q*this._sideLengths[o]/2));q=(w[l]>0)?-1:1;x=g.add(x,d.getScaleVector(y[l],q*this._sideLengths[l]/2));v[0]=g.add(x,d.getScaleVector(y[s],this._sideLengths[s]/2));v[1]=g.add(x,d.getScaleVector(y[s],-this._sideLengths[s]/2));return v;}}var t=v[0]=this.get_currentState().position.slice(0);q=(w[0]>0)?-1:1;v[0]=g.add(t,d.getScaleVector(y[0],q*this._sideLengths[0]/2));q=(w[1]>0)?-1:1;v[0]=g.add(t,d.getScaleVector(y[1],q*this._sideLengths[1]/2));q=(w[2]>0)?-1:1;v[0]=g.add(t,d.getScaleVector(y[2],q*this._sideLengths[2]/2));return v;};a.prototype.segmentIntersect=function(x,z,k){x.frac=0;x.position=[0,0,0,0];x.normal=[0,0,0,0];var j=d.NUM_HUGE;var v=-d.NUM_HUGE;var w=d.NUM_HUGE;var C=0;var i=0;var u=0;var s=g.subtract(k.position,z.origin);var y=d.getScaleVector(this._sideLengths,0.5);var B;var A;var q;var n;var m;var o=k.getOrientationCols();var r=y.slice(0);var l;for(u=0;u<3;u++){l=r[u];B=g.dotProduct(o[u],s);A=g.dotProduct(o[u],z.delta);if(Math.abs(A)>d.NUM_TINY){n=(B+l)/A;m=(B-l)/A;if(n>m){q=n;n=m;m=q;}if(n>v){v=n;C=u;}if(m<w){w=m;i=u;}if(v>w){return false;}if(w<0){return false;}}else{if(-B-l>0||-B+l<0){return false;}}}if(v>0){u=C;j=v;}else{u=i;j=w;}if(j<0){j=0;}if(j>1-d.NUM_TINY){return false;}x.frac=j;x.position=z.getPoint(j);if(g.dotProduct(o[u],z.delta)<0){x.normal=d.getScaleVector(o[u],-1);}else{x.normal=o[u];}return true;};a.prototype.getInertiaProperties=function(i){return b.getScaleMatrix((i/12)*(this._sideLengths[1]*this._sideLengths[1]+this._sideLengths[2]*this._sideLengths[2]),(i/12)*(this._sideLengths[0]*this._sideLengths[0]+this._sideLengths[2]*this._sideLengths[2]),(i/12)*(this._sideLengths[0]*this._sideLengths[0]+this._sideLengths[1]*this._sideLengths[1]));};a.prototype.updateBoundingBox=function(){this._boundingBox.clear();this._boundingBox.addBox(this);};c.JBox=a;})(jigLib);