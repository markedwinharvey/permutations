var id_num = 0, first_iteration = true, plot_id = '2',visualizing = false, graphing;

function plot(data,first_iteration){	//receive data from perm_op.py; generate plot and append to document
	var set_size = data[0], iterator = data[1], map = data[2];
	var oi = $('#iterator').val();
	if (oi.indexOf('.') != '-1'){		// format incoming iteration value for display
		var dec_places = oi.length - 1 - oi.indexOf('.');
		iterator = parseFloat(parseInt(iterator * Math.pow(10,dec_places))/Math.pow(10.,dec_places));
	}
	else{
		iterator = parseInt(iterator);
	}
	$('#current').html(iterator);			
	if (radio_selection == 'none' || radio_selection == 'multi'){	//generate new plot for either option 	
		var new_plot = document.createElement('div');
		plot_id = 'plot' + id_num;
		new_plot.id = plot_id;
		new_plot.className = 'plot';
		$('#plots').append(new_plot);
		$('#'+plot_id).css({
			'height':2*set_size,
			'width':2*set_size
		});
		for (i = 0; i < map.length; i++){							//fill new plot with points
			var point = document.createElement('div');
			point.className = 'point';
			point.style.marginLeft = i*2+'px';
			point.style.marginTop = 2*set_size - 2*map[i]+'px';
			$('#'+plot_id).append(point);
		}
		id_num++;			
	}		
	else{													// option 'single': generate animated data on single plot
		if (first_iteration){
			first_iteration = false;
			var new_plot = document.createElement('div');	//create new plot on first iteration
			plot_id = 'plot' + id_num;
			new_plot.id = plot_id;
			new_plot.className = 'plot';
			$('#plots').append(new_plot);
			$('#'+plot_id).css({
				'height':2*set_size,
				'width':2*set_size
			});	
			for (i = 0; i < map.length; i++){				//plot all points from data set
				var point = document.createElement('div');
				point.className = 'point';
				point.style.marginLeft = i*2+'px';
				point.style.marginTop = 2*set_size - 2*map[i]+'px';
				$('#'+plot_id).append(point);
			}
			id_num++;					
		}
		else{												//dynamic data plot - draw over and replace existing plot data (not first iteration)
			$('#'+plot_id).html('');
			for (i = 0; i < map.length; i++){
				var point = document.createElement('div');
				point.className = 'point';
				point.style.marginLeft = i*2+'px';
				point.style.marginTop = 2*set_size - 2*map[i]+'px';
				$('#'+plot_id).append(point);
			}
		}
	}
}

var radio_selection = 'single';								//radio button plot type selector listener
$(document).on('click','.radio_select',function(){
	radio_selection = this.id;
	if (radio_selection == 'none'){
		if (visualizing){
			clearInterval(graphing);
		}
	}
});

function process_data(set_size,iterator){			//send data to python for processing
	if (radio_selection == 'none'){				
		$.ajax({
			method:'post',
			url:'perm_op.py',						//python script to generate data array (perform once)
			data:{'package':JSON.stringify([set_size,iterator])},
			success: function(response){
				response = JSON.parse(response);
				plot(response,null);				//plot data
			}
		});
	}
	else{											//generate dynamic data (set interval to call python script repeatedly)
		var n = iterator;
		visualizing = true;
		graphing = setInterval(function(){			//start dynamic updating 							
			$('#iterator_stop').click(function(){	//stop iteration
				clearInterval(graphing);
				visualizing = false;
			});
			$.ajax({
				method:'post',
				url:'perm_op.py',						//get array data for plotting
				data:{'package':JSON.stringify([set_size,iterator])},
				success: function(response){
					response = JSON.parse(response);
					plot(response,first_iteration);		//plot data
					first_iteration = false;
				}
			});
			iterator += n;
		},50);			
	}			
}   

$(document).on('click','#visualize',function(){	//generate data; send user values to perm_op.py
	if (visualizing){return}					//ignore multiple clicks
	var set_size = $('#set_size').val();
	var iterator = $('#iterator').val();
	$('#message').html('');
	if (!(isNaN(set_size) || isNaN(iterator)) && $('#set_size').val() > 0 && $('#iterator').val() > 0 ){	//standard input data is ok
		process_data(parseInt(set_size),parseFloat(iterator));
	}
	else{
		$('#message').html('Check inputs. ');	//bad standard input data
	}
});