with (scope('Info', 'Fundraiser')) {
  // Note: fundraiser identifier will either be just an ID, or and ID with a concatenated title string
  route('#fundraisers/:fundraiser_id/info', function(fundraiser_id) {
    var target_div = div({ id: 'fundraiser-info' }, 'Loading...');

    render(target_div);

    BountySource.get_fundraiser_info(fundraiser_id, function(response) {
      if (response.meta.success) {
        var fundraiser = response.data;

        var rewards_with_pledges  = [],
            remaining_rewards     = [];

        for (var i=0; i<fundraiser.rewards.length; i++) {
          if (fundraiser.rewards[i].pledges.length > 0)
            rewards_with_pledges.push(fundraiser.rewards[i]);
          else
            remaining_rewards.push(fundraiser.rewards[i]);
        }

        render({ into: target_div },
          breadcrumbs(
            a({ href: '#' }, 'Home'),
            a({ href: fundraiser.frontend_path }, truncate(fundraiser.title, 100)),
            'Pledges'
          ),

          Columns.create({ show_side: false }),

          Columns.main(
            h3('Rewards with Pledges'),
            rewards_with_pledges.map(reward_table),

            h3('Remaining Rewards'),
            remaining_rewards.map(reward_table)
          ),

          Columns.side()
        );
      } else {
        render({ into: target_div }, error_message(response.data.error));
      }
    });
  });

  define('reward_table', function(reward) {

    console.log(reward);

    return div({ 'class': 'reward-info' },
      div({ 'class': 'reward-description' },
        div(money(reward.amount)),
        p(reward.description)
      ),
      div({ 'class': 'pledge-table' },
        reward.pledges.length <= 0 && div(
          div({ style: 'font-style: italic;' }, 'No pledges have been made for this reward.')
        ),

        reward.pledges.length > 0 && table(
          tr(
            th('Backer'),
            th('Pledge Amount'),
            reward.fulfillment_details.length > 0 && th('Survey Response')
          ),

          reward.pledges.map(function(pledge) {
            return tr(
              td({ style: 'height: 30px;' },
                a({ href: pledge.person.frontend_path }, pledge.person.display_name)
              ),
              td(
                money(pledge.amount)
              ),
              reward.fulfillment_details.length > 0 && td(
                pledge.survey_response
              )
            )
          })
        )
      )
    );


    return table(
      tr(
        th('Name'),
        th('Description'),
        th()
      )
    );




    return div({ 'class': 'reward' },
      h2({ 'class': 'reward-name' },
        (reward.amount ? "$" + reward.amount + " Reward: " : "No Reward:")
      ),

      reward.description && div({ style: "font-style: italic" }, reward.description),

      div({ 'class': "reward-info" },
        span("Claimed: " + (reward.amount ? reward.claimed : reward.pledges.length)),
        (reward.limited_to ? span({ style: 'margin-left: 15px' }, "Limited to: " + reward.limited_to) : "")
      ),

      reward.fulfillment_details && div({ 'class': 'survey-question' }, "Fulfillment Details: " + reward.fulfillment_details),

      reward.pledges.length > 0 && table({ 'class': 'users' },
        tr(
          th('User'),
          th('Amount'),
          th('Survey Response')
        ),
        reward.pledges.map(function(pledge) {
          return tr(

          );
        })
      )
    );
  });
}