import React from 'react';
import './css/ErrorPanel.css';
import { Typography, Card, CardHeader, CardContent, LinearProgress } from '@material-ui/core';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

export class MiningInProgressPanel extends React.Component {

  componentWillMount() {
    // TODO: remove logging when ga works properly
    console.log("Navigate to: /mint/mining"); // eslint-disable-line no-console
    ReactGA.pageview('/mint/mining');
  }

  render() {
    const etherscanLink = "https://etherscan.io/address/" + this.props.tokenOwner;

    return (
      <div>
        <Card className="card">
          <CardHeader
            title="Mining In Progress..."
            classes={{
              root: "card_header",
              title: "card_header_text"
            }}
          />
          <CardContent
            classes={{
              root: "card_content"
            }}
          >
            <Typography
              align="center"
              variant="subtitle1"
            >
              Your tokens are being mined. This might take a few minutes.
            </Typography>
            <Typography
              align="center"
              variant="subtitle1"
            >
              You can check the mining progress on <a href={etherscanLink} target="_blank">etherscan</a>.
            </Typography>
            <Typography
              align="center"
              variant="h6"
            >
              Please do not leave this page!
            </Typography>
          </CardContent>
        </Card>
        <form className="footer_main_form">
          <LinearProgress
            className="linear_progress"
            classes={{
              root:"linear_progress_root"
            }}
          />
        </form>
      </div>
    );
  }
}

MiningInProgressPanel.propTypes = {
  tokenOwner: PropTypes.string.isRequired
};

function mapStateToProps(state) {
  return {
    tokenOwner: state.tokenOwner
  };
}

export default connect(mapStateToProps)(MiningInProgressPanel);
