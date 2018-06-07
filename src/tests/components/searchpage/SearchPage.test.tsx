import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { Store } from 'redux';

import { configure, mount } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import configureStore from '../../../store/configureStore';

import MockApi from '../../api/mockApi';

import { setSeriesApi } from '../../../actions/seriesActions';
import { ISerieApi } from '../../../api/SerieApi';
import SearchPage from '../../../components/searchpage/SearchPage';


configure({ adapter: new Adapter() });

describe("SearchPage", () => {


  let mockSeriesApi: ISerieApi;
  let store: Store;
  let datasetSource: string;
  let datasetTheme: string;

  beforeEach(() => {

    mockSeriesApi = new MockApi(0);
    mockSeriesApi.searchSeries = jest.fn().mockImplementation(mockSeriesApi.searchSeries);
    mockSeriesApi.getSeries = jest.fn().mockImplementation(mockSeriesApi.getSeries);

    store = configureStore();
    store.dispatch(setSeriesApi(mockSeriesApi));

    datasetSource = "";
    datasetTheme = "";
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');

    ReactDOM.render(
      <MemoryRouter>
        <Provider store={store}>
          <SearchPage seriesApi={new MockApi(0)} />
        </Provider>
      </MemoryRouter>
      , div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('gets search results from seriesApi', () => {

    const searchterm = "exportaciones"

    mount(
      <MemoryRouter
        initialEntries={['/search/?q=' + searchterm]}
        initialIndex={0}>
        <Provider store={store}>
          <SearchPage seriesApi={mockSeriesApi} />
        </Provider>
      </MemoryRouter>
    );

    expect(mockSeriesApi.searchSeries).toHaveBeenCalledWith(searchterm, { datasetTheme, datasetSource, offset: 0, limit: 10 });
  });


  it('gets search results from seriesApi with limit and offset parameters', () => {

    const searchterm = "exportaciones"
    const offset = 10;
    const limit = 5;

    mount(
      <MemoryRouter
        initialEntries={[`/search/?offset=${offset}&limit=${limit}&q=${searchterm}`]}
        initialIndex={0}>
        <Provider store={store}>
          <SearchPage seriesApi={mockSeriesApi} />
        </Provider>
      </MemoryRouter>
    );

    expect(mockSeriesApi.searchSeries).toHaveBeenCalledWith(searchterm, { datasetTheme, datasetSource, offset, limit });
  });
});
