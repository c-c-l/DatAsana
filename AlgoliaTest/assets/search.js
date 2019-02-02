// Init
const search = instantsearch({
  appId: 'I9V7H2S6X9',
  apiKey: '94b10a23a4d80d836ac5c343a9e26ce0',
  indexName: 'yoga',
  routing: true
});

var facetTemplateCheckbox =
  '<li class="filters-item {{#isRefined}}selected{{/isRefined}}">' +
  '<a href="javascript:void(0);" class="facet-item">{{value}} ' +
  '<span class="facet-count">{{count}}</span>' +
  '</a></li>';

// Init SearchBox
search.addWidget(
  instantsearch.widgets.searchBox({
    container: '#search-box',
    placeholder: 'Search for an Asana'
  })
);

// Init clearAll
  search.addWidget(
    instantsearch.widgets.clearAll({
      container: '#clear-all',
      templates: {
        link: 'Clear'
      },
      autoHideContainer: false
    })
  );

// Init RefinementList
search.addWidget(
  instantsearch.widgets.refinementList({
    container: '#refinement-list',
    attributeName: 'Benefits',
    limit: 10,
    showMore: true,
    templates: {
      item: facetTemplateCheckbox
    },
  })
);
// Init widget
search.addWidget(
  instantsearch.widgets.hits({
    container: '#hits',
      templates: {
        empty: 'No results',
        item: '<span class="result-asana">{{Sanskrit}}</span>: <span class="result-english">{{{_highlightResult.English.value}}}</span>'
      }
    })
);
// initialize pagination
  search.addWidget(
    instantsearch.widgets.pagination({
      container: '#pagination',
      maxPages: 20,
      scrollTo: true
    })
  );
search.start();
