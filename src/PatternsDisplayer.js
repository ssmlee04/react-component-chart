import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
const candlePatterns = require('./patterns');

export class PatternsDisplayer extends React.Component {
  render() {
    const { patterns } = this.props;
    if (!patterns) return null;

    return (
      <div className='sansserif font-12 padding-5'>
        <span>Last arrow: </span>
        {patterns.map((pattern) => {
            const obj = _.find(candlePatterns, d => d.short === pattern);
            if (!obj) return null;
            return <div key={pattern} className='inline'>
              <Link to={`/patterns/${obj.short}`} key={pattern} className='font-12 green'>
                <img src={obj.imgUrl} style={{ width: 50, height: 50 }} />
                <span>{obj.name}</span>
              </Link>
            </div>;
          })}
      </div>
    );
  }
}

export default PatternsDisplayer;
