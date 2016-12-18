jQuery(document).foundation();
/* 
These functions make sure WordPress 
and Foundation play nice together.
*/

jQuery(document).ready(function() {
    
    // Remove empty P tags created by WP inside of Accordion and Orbit
    jQuery('.accordion p:empty, .orbit p:empty').remove();
    
	 // Makes sure last grid item floats left
	jQuery('.archive-grid .columns').last().addClass( 'end' );
	
	// Adds Flex Video to YouTube and Vimeo Embeds
	jQuery('iframe[src*="youtube.com"], iframe[src*="vimeo.com"]').wrap("<div class='flex-video'/>");

	jQuery( 'a' ).click( function() {
		jQuery('html, body').animate({
			scrollTop: jQuery("html").offset().top
		}, 500);
	});

});
function changeCurrentNavItem() {
	jQuery(function () {
		var currentItem = '';
		jQuery("#theme-slug-top-menu ul li").each(function () {
			if (jQuery(this).hasClass("current-item")) {
				currentItem = jQuery(this);
			}
		});
		var pgurl = window.location.href;
		var found = false;
		jQuery("#theme-slug-top-menu ul li").each(function () {
			if (jQuery(this).find("a").attr("href") == pgurl || jQuery(this).find("a").attr("href") == '') {
				if (currentItem != '') {
					currentItem.removeClass('current-item');
				}
				jQuery(this).addClass("current-item");
				currentItem = jQuery(this);
				found = true;
			}
			if (found == false) {
				if (currentItem != '') {
					currentItem.removeClass('current-item');
				}
			}
		});
	});
}
changeCurrentNavItem();

function getCommentById( commentID, comments_list ) {
	for ( j = 0; j < comments_list.length; j++ ) {
		if ( comments_list[j].comment_ID == commentID ) {
			return comments_list[j];
		}
	}
}
function getCommentDepth( theComment, comments_list ) {
	var depthLevel = 0;
	while ( theComment.comment_parent > 0 ) {
		theComment = getCommentById( theComment.comment_parent, comments_list );
		depthLevel++;
	}
	return depthLevel;
}
function arrangeComments( commentsList ) {
	var maxDepth = 0;
	for ( i = commentsList.length - 1; i >= 0; i-- ) {
		if ( commentsList[i].comment_approved != 1 ) {
			commentsList.splice( i, 1 );
		}
	}
	for ( i = 0; i < commentsList.length; i += 1 ) {
		commentsList[i].comment_children = [];
		var date = commentsList[i].comment_date.split(" ").join("T").concat("Z");
		commentsList[i].comment_date = new Date(date);
		commentsList[i].comment_depth = getCommentDepth( commentsList[i], commentsList );
		if ( getCommentDepth( commentsList[i], commentsList ) > maxDepth ) {
			maxDepth = getCommentDepth( commentsList[i], commentsList );
		}
	}
	for ( i = maxDepth; i > 0; i-- ) {
		for ( j = 0; j < commentsList.length; j++ ) {
			if ( commentsList[j].comment_depth == i ) {
				for ( k = 0; k < commentsList.length; k++ ) {
					if ( commentsList[j].comment_parent == commentsList[k].comment_ID ) {
						commentsList[k].comment_children.push( commentsList[j] )
					}
				}
			}
		}
	}
	for ( i = commentsList.length - 1; i >= 0; i-- ) {
		if ( commentsList[i].comment_parent > 0 ) {
			commentsList.splice( i, 1 );
		}
	}

	return commentsList;
}

function replyToComment( commentParentId ) {
	commentParentId = commentParentId.split("-").pop();
	jQuery( '#parent' ).val( commentParentId );
	var replyTo = jQuery( '#comment-' + commentParentId + ' .comment-name' ).html();
	jQuery('.add-comment').html( quotidiano.translations.replying_to + replyTo + '  <span onclick="removeReply()">' + quotidiano.translations.remove_reply + '</span>' );
	jQuery('html, body').animate({
		scrollTop: jQuery(".post-comments").offset().top
	}, 500);
}
function removeReply() {
	jQuery( '#parent' ).val('0');
	jQuery('.add-comment').html( quotidiano.translations.add_comment );
}

function setPaginationLinks( page, pagedUrl, headers, totalPages ) {
    if ( page ) {
        var currentPage = page;
    } else {
        var currentPage = 1;
    }

    if ( pagedUrl ) {
        var previousUrl = pagedUrl + ( currentPage - 1 ) + '/';
        var nextUrl = pagedUrl + ( currentPage + 1 ) + '/';
        jQuery( 'a#previous-posts' ).attr( 'href', previousUrl );
        jQuery( 'a#next-posts' ).attr( 'href', nextUrl );
        jQuery( 'a#previous-posts' ).click( function() {
            jQuery('html, body').animate({
                scrollTop: jQuery("html").offset().top
            }, 500);
        });
        jQuery( 'a#next-posts' ).click( function() {
            jQuery('html, body').animate({
                scrollTop: jQuery("html").offset().top
            }, 500);
        });
    }

    totalPages = headers('X-WP-TotalPages');

    if ( currentPage == 1 ) {
        jQuery( 'a#previous-posts' ).css( 'visibility', 'hidden' );
    }
    if ( currentPage == totalPages ) {
        jQuery( 'a#next-posts' ).css( 'visibility', 'hidden' );
    }
}

function getArchiveUrl( archiveType, endpoints, page  ) {
	var url = '';
	var pagedUrl = '';
	if ( archiveType == 'Author' ) {
        url = quotidiano.api_url + 'users?slug=' + endpoints[0];
        pagedUrl = quotidiano.site_url + 'author/' + endpoints[0] + '/page/';
    } else if ( archiveType == 'Category' ) {
        url = quotidiano.api_url + 'categories?slug=' + endpoints[0];
        pagedUrl = quotidiano.site_url + 'category/' + endpoints[0] + '/page/';
    } else if ( archiveType == 'Search' ) {
        if ( page > 1 ) {
            url = quotidiano.api_url + 'posts?search=' + endpoints[0] + '&page=' + page;
        } else {
            url = quotidiano.api_url + 'posts?search=' + endpoints[0];
        }
        pagedUrl = quotidiano.site_url + 'search/' + endpoints[0] + '/page/';
    } else if ( archiveType == 'Tag' ) {
        url = quotidiano.api_url + 'tags?slug=' + endpoints[0];
        pagedUrl = quotidiano.site_url + 'tag/' + endpoints[0] + '/page/';
    } else if ( archiveType == 'Year' ) {
        url = quotidiano.api_url + 'posts?year=' + endpoints[0];
        pagedUrl = quotidiano.site_url + '' + endpoints[0] + '/page/';
    } else if ( archiveType == 'Month' ) {
        url = quotidiano.api_url + 'posts?year=' + endpoints[0] + '&monthnum=' + endpoints[1];
        pagedUrl = quotidiano.site_url + '' + endpoints[0] + '/' + endpoints[1] + '/page/';
    } else if ( archiveType == 'Day' ) {
        url = quotidiano.api_url + 'posts?year=' + endpoints[0] + '&monthnum=' + endpoints[1] + '&day=' + endpoints[2];
        pagedUrl = quotidiano.site_url + '' + endpoints[0] + '/' + endpoints[1] + '/' + endpoints[2] + '/page/';
    }
    return [url, pagedUrl];
}

function getArchivePosts( archiveType, page, endpoint, endpointId ) {
	var url = '';
    if ( archiveType == 'Category' ) {
        if ( page > 1 ) {
            url = quotidiano.api_url + 'posts?categories=' + endpointId + '&page=' + page;
        } else {
            url = quotidiano.api_url + 'posts?categories=' + endpointId;
        }
    } else if ( archiveType == 'Tag' ) {
        if ( page > 1 ) {
            url = quotidiano.api_url + 'posts?tags=' + endpointId + '&page=' + page;
        } else {
            url = quotidiano.api_url + 'posts?tags=' + endpointId;
        }
    } else if ( archiveType == 'Author' ) {
        if ( page > 1 ) {
            url = quotidiano.api_url + 'posts?author=' + endpointId + '&page=' + page;
        } else {
            url = quotidiano.api_url + 'posts?author=' + endpointId;
        }
	}

    return url;
}

function getMonthName( month ) {
	month = month - 1;
	return quotidiano.months[month];
}

(function() {
	angular.module('myapp', ['ui.router', 'ngResource'])
		.factory('Comments',function($resource){
			return $resource(quotidiano.api_url+':ID/comments',{
				ID:'@id'
			},{
				'update':{method:'PUT'},
				'save':{
					method:'POST'
					/*headers: {
						'Content-Type': 'application/json',
						'X-WP-Nonce': quotidiano.nonce
					}*/
				}
			});
		})
        .service('homePosts', ['$http', function ($http) {
            this.getHomePosts = function ( currentYear, currentMonth ) {
            	if ( currentYear == '' || currentMonth == '' ) {
                    var promise = $http({
                        method: 'GET',
                        url: quotidiano.api_url + 'posts?per_page=1'
                    })
                        .success(function (res, status, headers, config) {
                            return res;
                        })
                        .error(function (data, status, headers, config) {
                            return {"status": false};
                        });
				} else {
                    var promise = $http({
                        method: 'GET',
                        url: quotidiano.api_url + 'posts?year=' + currentYear + '&monthnum=' + currentMonth + '&per_page=31'
                    })
                        .success(function (res, status, headers, config) {
                            return res;
                        })
                        .error(function (data, status, headers, config) {
                            return {"status": false};
                        });
                }
                return promise;
            }
        }])
		.controller('Home', ['$scope', '$http', '$stateParams', 'homePosts', function ($scope, $http, $stateParams, homePosts) {
			$scope.translations = quotidiano.translations;
            var loadedPosts = [];
            jQuery('.page-home-header').show();
            jQuery('.social-media').show();
            homePosts.getHomePosts( '', '' ).then( function( promise ) {
            	var post = promise.data[0];
            	var date = new Date( post.date );
            	var month = date.getMonth() + 1;
            	if ( month < 10 ) {
                    month = '0' + month;
                }
            	var year = date.getFullYear();
            	var loadedPosts = [];
                homePosts.getHomePosts( year, month ).then( function( promise ) {
					$scope.posts = promise.data;
                    month = getMonthName( month );
                    $scope.month_section_title = month + ' ' + year;
                    document.querySelector('title').innerHTML = quotidiano.site_title + ' | ' + quotidiano.site_description;
                    changeCurrentNavItem();
                    for ( i = 0; i < $scope.posts.length; i++ ) {
                    	loadedPosts.push( $scope.posts[i].id );
					}
				});
			});
		}])
		.controller('SinglePost', ['$scope', '$http', '$stateParams', 'Comments', function ($scope, $http, $stateParams, Comments) {
            $scope.translations = quotidiano.translations;
            jQuery('.page-home-header').hide();
            jQuery('.social-media').hide();
			$http.get(quotidiano.api_url + 'posts?slug=' + $stateParams.slug + '&_embed').success(function(res){
				$scope.post = res[0];
				$scope.post.comments = arrangeComments( $scope.post.comments );
				$scope.numComments = $scope.post.comments.length;
				$scope.loggedIn = quotidiano.logged_in;
				$scope.social_links = quotidiano.social_media_links;
				if ( $scope.loggedIn == true ) {
					$scope.currentUser = quotidiano.logged_in_user;
				}
				document.querySelector('title').innerHTML = res[0].title.rendered + ' | ' + quotidiano.site_title;
				changeCurrentNavItem();
			});
			$scope.savecomment = function(){
				$scope.openComment = {};
				$scope.openComment.author_name = jQuery('#name').val();
				$scope.openComment.author_email = jQuery('#email').val();
				$scope.openComment.parent = jQuery('#parent').val();
				$scope.openComment.content = jQuery('#comment-content').val();
				$scope.openComment.status = 'hold';
                $scope.openComment.post = jQuery('.single-view').attr('id').replace('post-', '');
                $http({
                    method: 'POST',
                    url: '/wp-json/wp/v2/comments',
                    params: $scope.openComment,
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': 'multipart/form-data', 'X-WP-Nonce': quotidiano.nonce }
                })
                    .success(function (result) {
                        console.log('Success!');
                    }).error(function (result) {
                    console.log('Fail!');
                    console.log(result);
                });
				jQuery('#comment-form').hide();
                jQuery('.comment-success').show();
			}
		}])
		.controller('Page', ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {
            $scope.translations = quotidiano.translations;
            jQuery('.page-home-header').hide();
            jQuery('.social-media').hide();
			$http.get( quotidiano.api_url + 'pages?slug=' + $stateParams.slug ).success(function(res){
				$scope.post = res[0];
                $scope.social_links = quotidiano.social_media_links;
				document.querySelector('title').innerHTML = res[0].title.rendered + ' | ' + quotidiano.site_title
				changeCurrentNavItem();
			});
		}])
		.controller('Archive', ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {
            $scope.translations = quotidiano.translations;
            jQuery('.page-home-header').hide();
            jQuery('.social-media').hide();
            $scope.social_links = quotidiano.social_media_links;
			var url = '';
			var pagedUrl = '';
			if ( $stateParams.archiveType == 'Day' || $stateParams.archiveType == 'Month' ) {
				var endpoints = [];
				if ( $stateParams.archiveType == 'Day' ) {
                    $scope.endpoints = [ $stateParams.year, $stateParams.month, $stateParams.endpoint ];
				} else {
                    $scope.endpoints = [ $stateParams.year, $stateParams.endpoint ];
				}
			} else {
                $scope.endpoints = [ $stateParams.endpoint ];
			}
			$scope.header_image = quotidiano.header_image;
			var urls = getArchiveUrl( $stateParams.archiveType, $scope.endpoints, $stateParams.page  );
			url = urls[0];
			pagedUrl = urls[1];
			if ( $stateParams.archiveType != 'Search' && $stateParams.archiveType != 'Year' && $stateParams.archiveType != 'Month' && $stateParams.archiveType != 'Day' ) {
				$http.get(url).success(function (res) {
					$scope.term = res[0];
					$scope.archiveType = $stateParams.archiveType;
					document.querySelector('title').innerHTML = $scope.term.name + ' | ' + quotidiano.site_title;
					if ( $stateParams.archiveType == 'Author' ) {
                        $scope.archiveTitle = 'Posts by: ' + $scope.term.name;
					} else {
                        $scope.archiveTitle = $scope.term.name;
                    }
					changeCurrentNavItem();
					var url = getArchivePosts( $stateParams.archiveType, $stateParams.page, $scope.endpoints[0], $scope.term.id );
                    $http.get(url).success(function (res, status, headers) {
						$scope.posts = res;
						$scope.totalPages = headers( 'X-WP-Total' );
                    });

				});
			} else {
				$http.get(url).success(function (res, status, headers) {
					$scope.posts = res;
					if ( $stateParams.archiveType == 'Search' ) {
                        document.querySelector('title').innerHTML = endpoints[0] + ' | ' + quotidiano.site_title;
                        $scope.archiveTitle = 'Search: ' + endpoints[0];
                    } else if ( $stateParams.archiveType == 'Year' ) {
                        document.querySelector('title').innerHTML = endpoints[0] + ' | ' + quotidiano.site_title;
                        $scope.archiveTitle = endpoints[0];
					} else if ( $stateParams.archiveType == 'Month' ) {
                        document.querySelector('title').innerHTML = getMonthName( endpoints[1] ) + ' ' + endpoints[0] + ' | ' + quotidiano.site_title;
                        $scope.archiveTitle = getMonthName( endpoints[1] ) + ' ' + endpoints[0];
                    } else {
                        document.querySelector('title').innerHTML = getMonthName (endpoints[1] ) + ' ' + endpoints[2] + ', ' + endpoints[0] + ' | ' + quotidiano.site_title;
                        $scope.archiveTitle = getMonthName( endpoints[1] ) + ' ' + endpoints[2] + ', ' + endpoints[0];
					}
				});
			}
		}])
		.controller('NotFound', ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {
            $scope.translations = quotidiano.translations;
            jQuery('.page-home-header').hide();
		}])
		.config([ '$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
			$stateProvider
				.state('Home', {
					url: '/',
					controller: 'Home',
					templateUrl: quotidiano.partials + 'home.html'
				})
				.state('Category', {
					url: '/category/:endpoint/',
					controller: 'Archive',
					params :{
						archiveType: 'Category'
					},
					templateUrl: quotidiano.partials + 'archive.html',
				})
				.state('CategoryPaged', {
					url: '/category/:endpoint/page/{page:int}/',
					controller: 'Archive',
					params :{
						archiveType: 'Category',
					},
					templateUrl: quotidiano.partials + 'archive.html',
				})
				.state('Author', {
					url: '/author/:endpoint/',
					controller: 'Archive',
					params :{
						archiveType: 'Author'
					},
					templateUrl: quotidiano.partials + 'archive.html',
				})
                .state('AuthorPaged', {
                    url: '/author/:endpoint/page/{page:int}/',
                    controller: 'Archive',
                    params :{
                        archiveType: 'Author',
                    },
                    templateUrl: quotidiano.partials + 'archive.html',
                })
				.state('Tag', {
					url: '/tag/:endpoint/',
					controller: 'Archive',
					params :{
						archiveType: 'Tag'
					},
					templateUrl: quotidiano.partials + 'archive.html',
				})
                .state('TagPaged', {
                    url: '/tag/:endpoint/page/{page:int}/',
                    controller: 'Archive',
                    params :{
                        archiveType: 'Tag'
                    },
                    templateUrl: quotidiano.partials + 'archive.html',
                })
				.state('Search', {
					url: '/search/:endpoint',
					controller: 'Archive',
					params :{
						archiveType: 'Search'
					},
					templateUrl: quotidiano.partials + 'archive.html',
				})
                .state('SearchPaged', {
                    url: '/search/:endpoint/page/{page:int}/',
                    controller: 'Archive',
                    params :{
                        archiveType: 'Search'
                    },
                    templateUrl: quotidiano.partials + 'archive.html',
                })
				.state('SinglePost', {
					url: '/{year:int}/{month:int}/{day:int}/:slug/',
					controller: 'SinglePost',
					templateUrl: quotidiano.partials + 'single.html'
				})
				.state('ArchiveYear', {
					url: '/{endpoint:int}/',
					controller: 'Archive',
					params :{
						archiveType: 'Year'
					},
					templateUrl: quotidiano.partials + 'archive.html',
				})
                .state('ArchiveYearPaged', {
                    url: '/{endpoint:int}/page/{page:int}/',
                    controller: 'Archive',
                    params :{
                        archiveType: 'Year'
                    },
                    templateUrl: quotidiano.partials + 'archive.html',
                })
				.state('ArchiveMonth', {
					url: '/{year:int}/{endpoint:int}/',
					controller: 'Archive',
					params :{
						archiveType: 'Month'
					},
					templateUrl: quotidiano.partials + 'archive.html',
				})
                .state('ArchiveMonthPaged', {
                    url: '/{year:int}/{endpoint:int}/page/{page:int}/',
                    controller: 'Archive',
                    params :{
                        archiveType: 'Month'
                    },
                    templateUrl: quotidiano.partials + 'archive.html',
                })
				.state('ArchiveDay', {
					url: '/{year:int}/{month:int}/{endpoint:int}/',
					controller: 'Archive',
					params :{
						archiveType: 'Day'
					},
					templateUrl: quotidiano.partials + 'archive.html',
				})
                .state('ArchiveDayPaged', {
                    url: '/{year:int}/{month:int}/{endpoint:int}/page/{page:int}/',
                    controller: 'Archive',
                    params :{
                        archiveType: 'Day'
                    },
                    templateUrl: quotidiano.partials + 'archive.html',
                })
                .state('Page', {
                    url: '/{slug:string}/',
                    controller: 'Page',
                    templateUrl: quotidiano.partials + 'page.html'
                })
				.state('NotFound', {
					url: '*path',
					templateUrl: quotidiano.partials + '404.html',
					controller: 'NotFound'
				});

			//Enable pretty permalinks, sans the #
			$locationProvider.html5Mode(true);
		}])
		.directive('collection', function () {
			return {
				restrict: "E",
				replace: true,
				scope: {
					collection: '='
				},
				template: "<ul><member ng-repeat='member in collection' member='member'></member></ul>"
			}
		})

		.directive('member', function ($compile) {
			return {
				restrict: "E",
				replace: true,
				scope: {
					member: '='
				},
				templateUrl: quotidiano.partials + 'comments.html',
				link: function (scope, element, attrs) {
					scope.translations = quotidiano.translations;
					var collectionSt = '<collection collection="member.comment_children"></collection>';
					if (angular.isArray(scope.member.comment_children)) {
						$compile(collectionSt)(scope, function(cloned, scope)   {
							element.append(cloned);
						});
					}
				}
			}
		})
        .directive('homeLoadMore', ['$compile', '$http', function($compile, $http) {
            return {
                restrict: 'E',
                replace: true,
				transclude: true,
                templateUrl: quotidiano.partials + 'loaded-home-post.html',
                link: function($scope, element, attrs) {
                	var j = 0;
                    $scope.loadMorePosts= function() {
                    	var ids = []
                        jQuery('.post').each( function () {
                        	ids.push(jQuery(this).attr('id').replace('post-', ''));
                            jQuery(this).removeAttr("ng-repeat");
						});
                    	var exclude = '';
						for ( i = 0; i < ids.length; i++ ) {
							if (i == ids.length - 1) {
								var sep = '';
							} else {
								var sep = ',';
							}

							exclude = exclude + '' + ids[i] + sep;
						}
                        $http.get(quotidiano.api_url + 'posts?exclude=' + exclude + '&per_page=1')
                            .success(function(data) {
                                var post = data[0];
                                var date = new Date( post.date );
                                var month = date.getMonth() + 1;
                                if ( month < 10 ) {
                                    month = '0' + month;
                                }
                                console.log(exclude)
                                var year = date.getFullYear();
                                $http.get(quotidiano.api_url + 'posts?year=' + year + '&monthnum=' + month + '&per_page=31')
                                    .success(function(data) {
                                        month = getMonthName( month );
                                        console.log(data);
                                        $scope.j = j;
                                    	$scope.new_section_date = month + ' ' + year;
                                    	$scope.new_posts = data;
                                    	$compile(element)($scope, function(cloned, $scope) {
                                    		element.parent().append(cloned);
                                    		element.parent().append(element);
										});
                                        jQuery('.post').each( function() {
                                            console.log(jQuery(this).attr('ng-repeat'));
                                            jQuery(this).removeAttr("ng-repeat");
                                            jQuery(this).addClass('removed');
                                        })
									})
							})
                    }
                }
            }
        }])
        .directive('archiveLoadMore', ['$compile', '$http', function($compile, $http) {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: quotidiano.partials + 'loaded-archive-post.html',
                link: function($scope, element, attrs) {
                    $scope.paged = 2;
                    $scope.loadMorePosts= function() {
                        jQuery('.post').each( function() {
                            jQuery(this).removeAttr("ng-repeat");
                            console.log(jQuery(this).attr('ng-repeat'));
                        })
                        var archiveType = jQuery('.archive-template').attr('id');
                        var url = getArchiveUrl( archiveType, $scope.$parent.endpoints, $scope.paged  );
                        if ( archiveType == 'Category' || archiveType == 'Tag' || archiveType == 'Author' ) {
                            console.log('two');
                            $http.get(url[0]).success(function (res) {
                                var term = res[0];
                                var url = getArchivePosts( archiveType, $scope.paged, $scope.$parent.endpoints[0], term.id );
                                $http.get(url).success(function (data, status, headers) {
                                    $scope.new_archive_posts = data;
                                    $compile(element)($scope, function(cloned, $scope) {
                                        element.parent().append(cloned);
                                        element.parent().append(element);
                                    });
                                    jQuery('.post').each( function() {
                                        console.log(jQuery(this).attr('ng-repeat'));
                                        jQuery(this).removeAttr("ng-repeat");
                                        jQuery(this).addClass('removed');
                                    })
                                    var totalPages = headers( 'X-WP-Total' );
                                    if ( $scope.paged == totalPages ) {

                                    } else {
                                        $scope.paged += 1;
                                    }
                                });
                            })
                        } else {
                        	url[0] = url[0] + '&page=' + $scope.paged;
                            $http.get(url[0])
                                .success(function(data, status, headers) {
                                    $scope.new_archive_posts = data;
                                    $compile(element)($scope, function(cloned, $scope) {
                                        element.parent().append(cloned);
                                        element.parent().append(element);
                                    });
                                    jQuery('.post').each( function() {
                                        console.log(jQuery(this).attr('ng-repeat'));
                                        jQuery(this).removeAttr("ng-repeat");
                                        jQuery(this).addClass('removed');
                                    })
                                    var totalPages = headers( 'X-WP-Total' );
                                    if ( $scope.paged == totalPages ) {

                                    } else {
                                        $scope.paged += 1;
                                    }
                                })
						}
                    }
                }
            }
        }])
		.filter('unsafe', function($sce) {
			return function(val) {
				return $sce.trustAsHtml(val);
			};
		});
})();