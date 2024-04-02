exports.range = function range(x, min, max){
    return x>=min && x<=max;
};

exports.average = function average(arr){
    var sum=0;
    for(let i= 0; i<arr.length;i++){
        sum+= arr[i];
    }
    var result = sum/arr.length;
    return result.toFixed(0);
}
